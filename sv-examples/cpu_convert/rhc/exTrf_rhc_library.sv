
        

        

        
/* verilator lint_off WIDTH */        
module sram_ 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic  a_data_in,
   output logic  a_data_out,
   input logic  a_addr,
   input logic  a_wmask
   );

   logic  mem;


    always_ff @(posedge clk) begin
        for(integer i=0; i<0; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<0; i=i+1) begin
            if(a_re & ~a_we & ~a_wmask[i]) begin
                a_data_out <= mem[a_addr][i*1 +: 1];
            end
            else if(a_re & a_we & ~a_wmask[i]) begin
                a_data_out[i*1 +: 1] <= mem[a_addr][i*1 +: 1];
            end
            `ifndef SYNTHESIS
            else if(a_re & a_we & a_wmask[i]) begin //output is X after reading and writing the same address at the same time
                a_data_out[i*1 +: 1] <= 'hx;
            end 
            `endif
        end
    end
    

endmodule
/* verilator lint_on WIDTH */        

        
/* verilator lint_off WIDTH */        
module  
   (
   input logic  a,
   input logic  cen,
   input logic  clk,
   input logic  d,
   input logic  gwen,
   input logic  wen,
   output logic  q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_ sram
      (
        .clk(clk),
        .a_re(cen),
        .a_we(we),
        .a_data_in(d),
        .a_data_out(q),
        .a_addr(a),
        .a_wmask(wen)        
      );


endmodule
/* verilator lint_on WIDTH */        

