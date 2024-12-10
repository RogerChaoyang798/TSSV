# TSSV  Integrate Register Block

Only Javascripts are provided for use to integrate register block.


### Run the flow
```bash
git clone git@192.168.90.119:runzhe.liu/tssv2redzone.git
cd TSSV
bsub -q be -Is /home/runzhe.liu/tssv2redzone/runRegBlockGen /home/runzhe.liu/sv-examples/reg_convert/AIGC_DEMO_Reg.csv 
```
在运行runRegBlock之前，修改其中的寄存器表格路径.参考/home/runzhe.liu/sv-examples/reg_convert/AIGC_DEMO_Reg.csv.



