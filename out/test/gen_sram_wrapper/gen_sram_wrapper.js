import * as fs from 'fs';
import path from 'path';
import { SRAM_WRAPPER } from 'tssv/lib/modules/SRAM_WRAPPER';
function parseSramData(sramPath) {
    const sramConfigs = JSON.parse(fs.readFileSync(sramPath, 'utf8'));
    Object.values(sramConfigs).forEach(sramConfig => {
        sramConfig.name = `${sramConfig.sram_type}_${sramConfig.width}x${sramConfig.depth}${sramConfig.muxBankCd}${sramConfig.suffix}`;
        const unfoldedOrigination = processOriginationUnfolds(sramConfig);
        sramConfig.originationUnfold = unfoldedOrigination;
    });
    console.log(sramConfigs);
    return sramConfigs;
}
function processOriginationUnfolds(sramConfig) {
    const unfolds = [];
    let instCounter = 0;
    let remainingWidth = sramConfig.width - 1;
    for (const origination of sramConfig.origination) {
        if (origination.type === 'SRAM') {
            for (let i = 0; i < origination.number; i++) {
                const unfold = {
                    ...origination,
                    width: origination.width,
                    depth: BigInt(origination.depth),
                    instName: `u_sram_${instCounter++}`,
                    bitBig: remainingWidth
                };
                unfolds.push(unfold);
                remainingWidth -= origination.width;
            }
        }
    }
    console.log(unfolds);
    return unfolds;
}
const extractSramList = (config) => {
    return config.origination
        .filter(item => item.type === 'SRAM')
        .map(item => {
        const match = item.module.match(/^(.*?)(_wrapper.*)$/);
        return match ? match[1] : item.module;
    })
        .join('\n');
};
const writeSramList = (filePath, data) => {
    fs.writeFileSync(filePath, data, 'utf-8');
};
function generateSramWrapper(config) {
    let ports;
    let writeEnableMask;
    switch (config.sram_type) {
        case 'ln05lpe_a00_mc_rd2r_hsr_lvt':
            ports = 'RD2_HS';
            writeEnableMask = 'none';
            break;
        case 'ln05lpe_a00_mc_rd2rw_hsr_lvt':
            ports = 'RD2_HS';
            writeEnableMask = 'bit';
            break;
        case 'ln05lpe_a00_mc_rf2r_hsr_lvt':
            ports = 'RF2_HS';
            writeEnableMask = 'none';
            break;
        case 'ln05lpe_a00_mc_rf2rw_hsr_lvt':
            ports = 'RF2_HS';
            writeEnableMask = 'bit';
            break;
        default:
            throw new Error(`Unsupported SRAM type: ${config.sram_type}`);
    }
    const wrapper = new SRAM_WRAPPER({
        name: `${config.name}`,
        dataWidth: config.width,
        depth: BigInt(config.depth),
        ports,
        writeEnableMask,
        subSrams: config.originationUnfold.map(origination => ({
            instName: origination.instName,
            module: origination.module,
            width: origination.width,
            depth: origination.depth,
            bitBig: origination.bitBig
        }))
    });
    // config.originationUnfold.forEach(origination => {
    //   const subSram = new SRAM_WRAPPER({
    //     name: `${origination.module}`,
    //     dataWidth: origination.width,
    //     depth: origination.depth,
    //     ports,
    //     writeEnableMask
    //   })
    // wrapper.addSubmodule(origination.instName, subSram, {}, true, true, true)
    // })
    return wrapper.writeVerilog();
}
function ensureFileExists(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, '', 'utf8');
    console.log(`File created or overwritten: ${filePath}`);
}
function main() {
    const inputPath = process.argv[2];
    const outputPath = process.argv[3];
    try {
        const sramConfigs = parseSramData(inputPath);
        for (const sramConfig of Object.values(sramConfigs)) {
            const sramList = extractSramList(sramConfig);
            writeSramList(outputPath, sramList);
            console.log(`SRAM list has been written to ${outputPath}`);
            // const originationVerilog = generateOrigination(sramConfig.origination)
            const wrapperVerilog = generateSramWrapper(sramConfig);
            const wrapperPath = `${sramConfig.output_dir}/${sramConfig.name}_wrapper.v`;
            ensureFileExists(wrapperPath);
            fs.writeFileSync(wrapperPath, wrapperVerilog, 'utf-8');
            console.log(`SRAM_WRAPPER has been written to ${wrapperPath}`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        }
        else {
            console.error('An unknown error occurred:', error);
        }
    }
}
main();
