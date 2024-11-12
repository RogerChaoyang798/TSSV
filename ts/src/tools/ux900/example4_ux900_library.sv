
        

        

        
/* verilator lint_off WIDTH */        
module sram_ 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [21:0] a_data_in,
   output logic [21:0] a_data_out,
   input logic [7:0] a_addr,
   input logic [21:0] a_wmask
   );

   logic [21:0] mem [0:255];


    always_ff @(posedge clk) begin
        for(integer i=0; i<22; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<22; i=i+1) begin
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
   input logic [7:0] a,
   input logic  cen,
   input logic  clk,
   input logic [21:0] d,
   input logic  gwen,
   input logic [21:0] wen,
   output logic [21:0] q
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


        

        

        
/* verilator lint_off WIDTH */        
module sram_ 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [19:0] a_data_in,
   output logic [19:0] a_data_out,
   input logic [7:0] a_addr,
   input logic [19:0] a_wmask
   );

   logic [19:0] mem [0:255];


    always_ff @(posedge clk) begin
        for(integer i=0; i<20; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<20; i=i+1) begin
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
   input logic [7:0] a,
   input logic  cen,
   input logic  clk,
   input logic [19:0] d,
   input logic  gwen,
   input logic [19:0] wen,
   output logic [19:0] q
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


        

        

        
/* verilator lint_off WIDTH */        
module sram_ 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [14:0] a_data_in,
   output logic [14:0] a_data_out,
   input logic [7:0] a_addr,
   input logic [14:0] a_wmask
   );

   logic [14:0] mem [0:255];


    always_ff @(posedge clk) begin
        for(integer i=0; i<15; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<15; i=i+1) begin
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
   input logic [7:0] a,
   input logic  cen,
   input logic  clk,
   input logic [14:0] d,
   input logic  gwen,
   input logic [14:0] wen,
   output logic [14:0] q
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


        

        

        
/* verilator lint_off WIDTH */        
module sram_ 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [63:0] a_data_in,
   output logic [63:0] a_data_out,
   input logic [11:0] a_addr,
   input logic [63:0] a_wmask
   );

   logic [63:0] mem [0:4095];


    always_ff @(posedge clk) begin
        for(integer i=0; i<64; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<64; i=i+1) begin
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
   input logic [11:0] a,
   input logic  cen,
   input logic  clk,
   input logic [63:0] d,
   input logic  gwen,
   input logic [63:0] wen,
   output logic [63:0] q
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

