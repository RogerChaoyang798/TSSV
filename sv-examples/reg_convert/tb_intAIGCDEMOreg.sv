



interface APB4_12_32;

logic  PCLK;
logic  PRESETn;
logic [11:0] PADDR;
logic  PSELx;
logic  PENABLE;
logic  PWRITE;
logic [31:0] PRDATA;
logic [31:0] PWDATA;
logic [2:0] PPROT;
logic [3:0] PSTRB;
logic  PREADY;
logic  PSLVERR;
logic  PCLKEN;


modport outward (
input PCLK,
input PRESETn,
output PADDR,
output PSELx,
output PENABLE,
output PWRITE,
input PRDATA,
output PWDATA,
output PPROT,
output PSTRB,
input PREADY,
input PSLVERR,
input PCLKEN
);

modport inward (
input PCLK,
input PRESETn,
input PADDR,
input PSELx,
input PENABLE,
input PWRITE,
output PRDATA,
input PWDATA,
input PPROT,
input PSTRB,
output PREADY,
output PSLVERR,
input PCLKEN
);


endinterface




/* verilator lint_off WIDTH */
module AIGC_DEMO_reg
(
input logic  clk,
input logic  rst_b,
input logic [31:0] cfg_UNIT_ID,
output logic [31:0] cfg_CTRL,
output logic [31:0] cfg_CFG0,
input logic [31:0] cfg_DEBUG_0,
input logic [31:0] cfg_DEBUG_1,
output logic [31:0] cfg_DUMMY_DEBUG,
APB4_12_32.inward regs
);

logic  reg_rd;
logic  reg_wr;
logic [11:0] reg_addr;
logic [31:0] reg_rdata;
logic [31:0] reg_wdata;
logic [31:0] next_rdata;
logic  in_range;
logic [3:0] reg_wstrb;
logic [31:0] clrzeros;
logic  slverr;
logic  dec_UNIT_ID;
logic [31:0] reg_UNIT_ID;
logic  dec_CTRL;
logic [31:0] reg_CTRL;
logic  CTRL_RE;
logic  CTRL_WE;
logic  dec_CFG0;
logic [31:0] reg_CFG0;
logic  CFG0_sc;
logic  CFG0_WE;
logic  dec_DEBUG_0;
logic [31:0] reg_DEBUG_0;
logic  dec_DEBUG_1;
logic [31:0] reg_DEBUG_1;
logic  dec_DUMMY_DEBUG;
logic [31:0] reg_DUMMY_DEBUG;
logic  DUMMY_DEBUG_RE;
logic  DUMMY_DEBUG_WE;

assign clrzeros = 32'h0;
// apb interface
always_comb
begin
reg_wr = regs.PSELx && regs.PENABLE && regs.PWRITE;
reg_rd = regs.PSELx && !regs.PENABLE && !regs.PWRITE;
reg_addr = regs.PADDR;
reg_wdata = regs.PWDATA;
regs.PRDATA = reg_rdata;

regs.PREADY = 1'b1;
regs.PSTRB = reg_wstrb;
end

assign slverr = regs.PSELx && !in_range;
assign dec_UNIT_ID = (regs.PADDR == 12'h000) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_UNIT_ID = cfg_UNIT_ID;
assign dec_CTRL = (regs.PADDR == 12'h004) ? 1'd1 : 1'd0;
assign CTRL_RE = reg_rd && dec_CTRL;
assign CTRL_WE = reg_wr && dec_CTRL;
// non-RO: output
assign cfg_CTRL = reg_CTRL;
assign dec_CFG0 = (regs.PADDR == 12'h00C) ? 1'd1 : 1'd0;
assign CFG0_WE = reg_wr && dec_CFG0;
// non-RO: output
assign cfg_CFG0 = reg_CFG0;
assign dec_DEBUG_0 = (regs.PADDR == 12'h400) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_DEBUG_0 = cfg_DEBUG_0;
assign dec_DEBUG_1 = (regs.PADDR == 12'h404) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_DEBUG_1 = cfg_DEBUG_1;
assign dec_DUMMY_DEBUG = (regs.PADDR == 12'hFFC) ? 1'd1 : 1'd0;
assign DUMMY_DEBUG_RE = reg_rd && dec_DUMMY_DEBUG;
assign DUMMY_DEBUG_WE = reg_wr && dec_DUMMY_DEBUG;
// non-RO: output
assign cfg_DUMMY_DEBUG = reg_DUMMY_DEBUG;
// address decode
assign in_range = |{dec_UNIT_ID,
dec_CTRL,
dec_CFG0,
dec_DEBUG_0,
dec_DEBUG_1,
dec_DUMMY_DEBUG};
// Read data mux
assign next_rdata =
( {32{dec_UNIT_ID}} & reg_UNIT_ID ) |
( {32{dec_CTRL}} & reg_CTRL ) |
( {32{dec_CFG0}} & 32'h0 ) |
( {32{dec_DEBUG_0}} & reg_DEBUG_0 ) |
( {32{dec_DEBUG_1}} & reg_DEBUG_1 ) |
( {32{dec_DUMMY_DEBUG}} & reg_DUMMY_DEBUG );

always_ff @( posedge clk  or negedge rst_b )
if(!rst_b)
begin
regs.PSLVERR <= 'd0;
end
else if(reg_rd)
begin
regs.PSLVERR <= slverr;
end

always_ff @( posedge clk  or negedge rst_b )
if(!rst_b)
begin
reg_CTRL <= 'd65537;
end
else if(CTRL_WE)
begin
reg_CTRL <= reg_wdata;
end

always_ff @( posedge clk  or negedge rst_b )
if(!rst_b)
begin
reg_CFG0 <= 'd0;
end
else if(CFG0_WE)
begin
reg_CFG0 <= reg_wdata;
end

always_ff @( posedge clk  or negedge rst_b )
if(!rst_b)
begin
reg_CFG0 <= 'd0;
end
else if(CFG0_sc)
begin
reg_CFG0 <= clrzeros;
end

always_ff @( posedge clk  or negedge rst_b )
if(!rst_b)
begin
CFG0_sc <= 'd0;
end
else
begin
CFG0_sc <= CFG0_sc;
end

always_ff @( posedge clk  or negedge rst_b )
if(!rst_b)
begin
reg_DUMMY_DEBUG <= 'd0;
end
else if(DUMMY_DEBUG_WE)
begin
reg_DUMMY_DEBUG <= reg_wdata;
end

always_ff @( posedge clk  or negedge rst_b )
if(!rst_b)
begin
reg_rdata <= 'd0;
end
else if()
begin
reg_rdata <= next_rdata;
end


endmodule
/* verilator lint_on WIDTH */


/* verilator lint_off WIDTH */
module tb_testRegBlock
(
input logic  clk,
input logic  rst_b
);

APB4_12_32 regs();
logic [31:0] cfg_UNIT_ID;
logic [31:0] cfg_CTRL;
logic [31:0] cfg_CFG0;
logic [31:0] cfg_DEBUG_0;
logic [31:0] cfg_DEBUG_1;
logic [31:0] cfg_DUMMY_DEBUG;


logic [15:0] count;

always @(posedge clk or negedge rst_b) begin
if (!rst_b) begin
count <= 'd0;
end else begin
count <= count + 1'b1;

case (count)
'd0: begin
regs.PADDR <= 32'h00000000;
regs.PWDATA <= 32'h12345678;
regs.PWRITE <= 1;
regs.PENABLE <= 1;
end
'd1: begin
regs.PWRITE <= 0;
regs.PWRITE <= 0;
regs.PENABLE <= 1;
end
'd2: begin
regs.PWRITE <= 0;
regs.PENABLE <= 0;
end
'd3: begin
regs.PADDR <= 32'h00000008;
regs.PWDATA <= 32'h87654321;
regs.PWRITE <= 1;
end
'd4: begin
regs.PWRITE <= 0;
regs.PENABLE <= 1;
end
'd5: begin
regs.PWRITE <= 0;
regs.PENABLE <= 0;
end
'd6: begin
regs.PADDR <= 32'h00000020;
regs.PWDATA <= 32'hAABBCCDD;
regs.PWRITE <= 1;
end
'd7: begin
regs.PWRITE <= 0;
regs.PENABLE <= 1;
end
'd8: begin
regs.PWRITE <= 0;
regs.PENABLE <= 0;
end
'd9: begin
// End of test
$finish;
end
default: ;
endcase
end
end

AIGC_DEMO_reg dut
(
.clk(clk),
.rst_b(rst_b),
.cfg_UNIT_ID(cfg_UNIT_ID),
.cfg_CTRL(cfg_CTRL),
.cfg_CFG0(cfg_CFG0),
.cfg_DEBUG_0(cfg_DEBUG_0),
.cfg_DEBUG_1(cfg_DEBUG_1),
.cfg_DUMMY_DEBUG(cfg_DUMMY_DEBUG),
.regs(regs)
);


endmodule
/* verilator lint_on WIDTH */
