// import { Module, type TSSVParameters, type IntRange, Expr } from 'tssv/lib/core/TSSV'
import { Module, Expr } from 'tssv/lib/core/TSSV';
export class SRAM_WRAPPER extends Module {
    constructor(params) {
        super({
            name: params.name,
            dataWidth: params.dataWidth,
            depth: params.depth,
            ports: params.ports,
            writeEnableMask: params.writeEnableMask || 'none',
            macroConfig: params.macroConfig || 'default',
            subSrams: params.subSrams || []
        });
        this.subSrams = this.params.subSrams || [];
        // define IO signals
        switch (this.params.ports) {
            case 'RD2_HS':
                {
                    this.IOs = {
                        CK: { direction: 'input', isClock: 'posedge' },
                        REN: { direction: 'input' },
                        WEN: { direction: 'input' },
                        DI: { direction: 'input', width: this.params.dataWidth },
                        RA: { direction: 'input', width: this.bitWidth(this.params.depth - 1n) },
                        WA: { direction: 'input', width: this.bitWidth(this.params.depth - 1n) },
                        DOUT: { direction: 'output', width: this.params.dataWidth },
                        MCSRD: { direction: 'input', width: 2 },
                        MCSWR: { direction: 'input', width: 2 },
                        RET: { direction: 'input', width: 1 },
                        ADME: { direction: 'input', width: 3 }
                    };
                    if (this.params.writeEnableMask === 'bit') {
                        this.IOs.BWEN = { direction: 'input', width: this.params.dataWidth };
                    }
                }
                this.instantiateSubSrams();
        }
    }
    instantiateSubSrams() {
        const DOut_list = [];
        this.subSrams.forEach(sram => {
            if (sram.type === 'SRAM') {
            const DOut_sub = this.addSignal(`DOUT_${sram.instName.toUpperCase()}`, { width: sram.width, type: 'wire' });
            const DI_sub = this.addSignal(`DI_${sram.instName.toUpperCase()}`, { width: sram.width, type: 'wire' });
            if (sram.bitBig >= (sram.width - 1)) {
                this.addAssign({ in: new Expr(`DI[${sram.bitBig}:${sram.bitBig - (sram.width - 1)}]`), out: DI_sub });
                DOut_list.push(DOut_sub.toString());
            }
            else {
                this.addAssign({ in: new Expr(`{DI[${sram.bitBig}:0], ${sram.width - 1 - sram.bitBig}'d0}`), out: DI_sub });
                DOut_list.push(`${DOut_sub.toString()}[${sram.width - 1}:${sram.width - 1 - sram.bitBig}]`);
            }
                this.addSubmodule(sram.instName, new Module({
                    name: sram.module
                }, {
                    CK: { direction: 'input', isClock: 'posedge' },
                    REN: { direction: 'input' },
                    WEN: { direction: 'input' },
                    DI: { direction: 'input', width: sram.width },
                    RA: { direction: 'input', width: this.bitWidth(sram.depth - 1n) },
                    WA: { direction: 'input', width: this.bitWidth(sram.depth - 1n) },
                    DOUT: { direction: 'output', width: sram.width },
                    MCSRD: { direction: 'input', width: 2 },
                    MCSWR: { direction: 'input', width: 2 },
                    RET: { direction: 'input', width: 1 },
                    ADME: { direction: 'input', width: 3 }
                }), { DI: DI_sub, DOUT: DOut_sub }, true, true, true);
            }
            else if (sram.type === 'REG') {
                this.body +=
                    `
reg  [${sram.width - 1}:0]      DI_REG_0 [${sram.depth - 1n}:0];
reg  [${sram.width - 1}:0]      DOUT_REG_0;
always @(posedge CK) begin
    if (~WEN) begin
        DI_REG_0[WA] <= DI[${sram.width - 1}:0];
    end
end

always @(posedge CK) begin
    if (~REN) begin
        DOUT_REG_0 <= DI_REG_0[RA];
    end
end
`;
                DOut_list.push('DOUT_REG_0');
            }
        });
        this.addAssign({ in: new Expr(`{${DOut_list.join(', ')}}`), out: 'DOUT' });
    }
}
export default SRAM_WRAPPER;
