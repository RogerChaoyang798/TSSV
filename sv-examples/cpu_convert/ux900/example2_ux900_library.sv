
        

        

        
/* verilator lint_off WIDTH */        
module sram_ilm_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [63:0] a_data_in,
   output logic [63:0] a_data_out,
   input logic [14:0] a_addr,
   input logic [63:0] a_wmask
   );

   logic [63:0] mem [0:32767];


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
module u_ilm_ram 
   (
   input logic [14:0] a,
   input logic  cen,
   input logic  clk,
   input logic [63:0] d,
   input logic  gwen,
   input logic [63:0] wen,
   output logic [63:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_ilm_ram sram
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
module sram_dlm0_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [31:0] a_data_in,
   output logic [31:0] a_data_out,
   input logic [14:0] a_addr,
   input logic [31:0] a_wmask
   );

   logic [31:0] mem [0:32767];


    always_ff @(posedge clk) begin
        for(integer i=0; i<32; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<32; i=i+1) begin
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
module u_dlm0_ram 
   (
   input logic [14:0] a,
   input logic  cen,
   input logic  clk,
   input logic [31:0] d,
   input logic  gwen,
   input logic [31:0] wen,
   output logic [31:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_dlm0_ram sram
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
module sram_dlm1_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [31:0] a_data_in,
   output logic [31:0] a_data_out,
   input logic [14:0] a_addr,
   input logic [31:0] a_wmask
   );

   logic [31:0] mem [0:32767];


    always_ff @(posedge clk) begin
        for(integer i=0; i<32; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<32; i=i+1) begin
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
module u_dlm1_ram 
   (
   input logic [14:0] a,
   input logic  cen,
   input logic  clk,
   input logic [31:0] d,
   input logic  gwen,
   input logic [31:0] wen,
   output logic [31:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_dlm1_ram sram
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
module sram_bht_ram_bank0 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [15:0] a_data_in,
   output logic [15:0] a_data_out,
   input logic [9:0] a_addr,
   input logic [15:0] a_wmask
   );

   logic [15:0] mem [0:1023];


    always_ff @(posedge clk) begin
        for(integer i=0; i<16; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<16; i=i+1) begin
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
module u_bht_ram_bank0 
   (
   input logic [9:0] a,
   input logic  cen,
   input logic  clk,
   input logic [15:0] d,
   input logic  gwen,
   input logic [15:0] wen,
   output logic [15:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_bht_ram_bank0 sram
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
module sram_bht_ram_bank1 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [15:0] a_data_in,
   output logic [15:0] a_data_out,
   input logic [9:0] a_addr,
   input logic [15:0] a_wmask
   );

   logic [15:0] mem [0:1023];


    always_ff @(posedge clk) begin
        for(integer i=0; i<16; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<16; i=i+1) begin
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
module u_bht_ram_bank1 
   (
   input logic [9:0] a,
   input logic  cen,
   input logic  clk,
   input logic [15:0] d,
   input logic  gwen,
   input logic [15:0] wen,
   output logic [15:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_bht_ram_bank1 sram
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
module sram_bht_ram_bank2 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [15:0] a_data_in,
   output logic [15:0] a_data_out,
   input logic [9:0] a_addr,
   input logic [15:0] a_wmask
   );

   logic [15:0] mem [0:1023];


    always_ff @(posedge clk) begin
        for(integer i=0; i<16; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<16; i=i+1) begin
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
module u_bht_ram_bank2 
   (
   input logic [9:0] a,
   input logic  cen,
   input logic  clk,
   input logic [15:0] d,
   input logic  gwen,
   input logic [15:0] wen,
   output logic [15:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_bht_ram_bank2 sram
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
module sram_bht_ram_bank3 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [15:0] a_data_in,
   output logic [15:0] a_data_out,
   input logic [9:0] a_addr,
   input logic [15:0] a_wmask
   );

   logic [15:0] mem [0:1023];


    always_ff @(posedge clk) begin
        for(integer i=0; i<16; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<16; i=i+1) begin
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
module u_bht_ram_bank3 
   (
   input logic [9:0] a,
   input logic  cen,
   input logic  clk,
   input logic [15:0] d,
   input logic  gwen,
   input logic [15:0] wen,
   output logic [15:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_bht_ram_bank3 sram
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
module sram_btb_ram_bank0 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [139:0] a_data_in,
   output logic [139:0] a_data_out,
   input logic [4:0] a_addr,
   input logic [139:0] a_wmask
   );

   logic [139:0] mem [0:31];


    always_ff @(posedge clk) begin
        for(integer i=0; i<140; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<140; i=i+1) begin
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
module u_btb_ram_bank0 
   (
   input logic [4:0] a,
   input logic  cen,
   input logic  clk,
   input logic [139:0] d,
   input logic  gwen,
   input logic [139:0] wen,
   output logic [139:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_btb_ram_bank0 sram
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
module sram_btb_ram_bank1 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [139:0] a_data_in,
   output logic [139:0] a_data_out,
   input logic [4:0] a_addr,
   input logic [139:0] a_wmask
   );

   logic [139:0] mem [0:31];


    always_ff @(posedge clk) begin
        for(integer i=0; i<140; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<140; i=i+1) begin
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
module u_btb_ram_bank1 
   (
   input logic [4:0] a,
   input logic  cen,
   input logic  clk,
   input logic [139:0] d,
   input logic  gwen,
   input logic [139:0] wen,
   output logic [139:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_btb_ram_bank1 sram
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
module sram_btb_ram_bank2 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [139:0] a_data_in,
   output logic [139:0] a_data_out,
   input logic [4:0] a_addr,
   input logic [139:0] a_wmask
   );

   logic [139:0] mem [0:31];


    always_ff @(posedge clk) begin
        for(integer i=0; i<140; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<140; i=i+1) begin
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
module u_btb_ram_bank2 
   (
   input logic [4:0] a,
   input logic  cen,
   input logic  clk,
   input logic [139:0] d,
   input logic  gwen,
   input logic [139:0] wen,
   output logic [139:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_btb_ram_bank2 sram
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
module sram_btb_ram_bank3 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [139:0] a_data_in,
   output logic [139:0] a_data_out,
   input logic [4:0] a_addr,
   input logic [139:0] a_wmask
   );

   logic [139:0] mem [0:31];


    always_ff @(posedge clk) begin
        for(integer i=0; i<140; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<140; i=i+1) begin
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
module u_btb_ram_bank3 
   (
   input logic [4:0] a,
   input logic  cen,
   input logic  clk,
   input logic [139:0] d,
   input logic  gwen,
   input logic [139:0] wen,
   output logic [139:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_btb_ram_bank3 sram
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
module sram_icache_tag0_ram 
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
module u_icache_tag0_ram 
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

    sram_icache_tag0_ram sram
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
module sram_icache_tag1_ram 
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
module u_icache_tag1_ram 
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

    sram_icache_tag1_ram sram
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
module sram_icache_data0_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [63:0] a_data_in,
   output logic [63:0] a_data_out,
   input logic [10:0] a_addr,
   input logic [63:0] a_wmask
   );

   logic [63:0] mem [0:2047];


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
module u_icache_data0_ram 
   (
   input logic [10:0] a,
   input logic  cen,
   input logic  clk,
   input logic [63:0] d,
   input logic  gwen,
   input logic [63:0] wen,
   output logic [63:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_icache_data0_ram sram
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
module sram_icache_data1_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [63:0] a_data_in,
   output logic [63:0] a_data_out,
   input logic [10:0] a_addr,
   input logic [63:0] a_wmask
   );

   logic [63:0] mem [0:2047];


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
module u_icache_data1_ram 
   (
   input logic [10:0] a,
   input logic  cen,
   input logic  clk,
   input logic [63:0] d,
   input logic  gwen,
   input logic [63:0] wen,
   output logic [63:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_icache_data1_ram sram
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
module sram_dcache_w0_tram_ram 
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
module u_dcache_w0_tram_ram 
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

    sram_dcache_w0_tram_ram sram
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
module sram_dcache_w1_tram_ram 
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
module u_dcache_w1_tram_ram 
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

    sram_dcache_w1_tram_ram sram
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
module sram_dcache_dram_b0_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [31:0] a_data_in,
   output logic [31:0] a_data_out,
   input logic [9:0] a_addr,
   input logic [31:0] a_wmask
   );

   logic [31:0] mem [0:1023];


    always_ff @(posedge clk) begin
        for(integer i=0; i<32; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<32; i=i+1) begin
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
module u_dcache_dram_b0_ram 
   (
   input logic [9:0] a,
   input logic  cen,
   input logic  clk,
   input logic [31:0] d,
   input logic  gwen,
   input logic [31:0] wen,
   output logic [31:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_dcache_dram_b0_ram sram
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
module sram_dcache_dram_b1_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [31:0] a_data_in,
   output logic [31:0] a_data_out,
   input logic [9:0] a_addr,
   input logic [31:0] a_wmask
   );

   logic [31:0] mem [0:1023];


    always_ff @(posedge clk) begin
        for(integer i=0; i<32; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<32; i=i+1) begin
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
module u_dcache_dram_b1_ram 
   (
   input logic [9:0] a,
   input logic  cen,
   input logic  clk,
   input logic [31:0] d,
   input logic  gwen,
   input logic [31:0] wen,
   output logic [31:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_dcache_dram_b1_ram sram
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
module sram_dcache_dram_b2_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [31:0] a_data_in,
   output logic [31:0] a_data_out,
   input logic [9:0] a_addr,
   input logic [31:0] a_wmask
   );

   logic [31:0] mem [0:1023];


    always_ff @(posedge clk) begin
        for(integer i=0; i<32; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<32; i=i+1) begin
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
module u_dcache_dram_b2_ram 
   (
   input logic [9:0] a,
   input logic  cen,
   input logic  clk,
   input logic [31:0] d,
   input logic  gwen,
   input logic [31:0] wen,
   output logic [31:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_dcache_dram_b2_ram sram
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
module sram_dcache_dram_b3_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [31:0] a_data_in,
   output logic [31:0] a_data_out,
   input logic [9:0] a_addr,
   input logic [31:0] a_wmask
   );

   logic [31:0] mem [0:1023];


    always_ff @(posedge clk) begin
        for(integer i=0; i<32; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<32; i=i+1) begin
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
module u_dcache_dram_b3_ram 
   (
   input logic [9:0] a,
   input logic  cen,
   input logic  clk,
   input logic [31:0] d,
   input logic  gwen,
   input logic [31:0] wen,
   output logic [31:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_dcache_dram_b3_ram sram
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
module sram_dcache_dram_b4_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [31:0] a_data_in,
   output logic [31:0] a_data_out,
   input logic [9:0] a_addr,
   input logic [31:0] a_wmask
   );

   logic [31:0] mem [0:1023];


    always_ff @(posedge clk) begin
        for(integer i=0; i<32; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<32; i=i+1) begin
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
module u_dcache_dram_b4_ram 
   (
   input logic [9:0] a,
   input logic  cen,
   input logic  clk,
   input logic [31:0] d,
   input logic  gwen,
   input logic [31:0] wen,
   output logic [31:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_dcache_dram_b4_ram sram
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
module sram_dcache_dram_b5_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [31:0] a_data_in,
   output logic [31:0] a_data_out,
   input logic [9:0] a_addr,
   input logic [31:0] a_wmask
   );

   logic [31:0] mem [0:1023];


    always_ff @(posedge clk) begin
        for(integer i=0; i<32; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<32; i=i+1) begin
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
module u_dcache_dram_b5_ram 
   (
   input logic [9:0] a,
   input logic  cen,
   input logic  clk,
   input logic [31:0] d,
   input logic  gwen,
   input logic [31:0] wen,
   output logic [31:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_dcache_dram_b5_ram sram
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
module sram_dcache_dram_b6_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [31:0] a_data_in,
   output logic [31:0] a_data_out,
   input logic [9:0] a_addr,
   input logic [31:0] a_wmask
   );

   logic [31:0] mem [0:1023];


    always_ff @(posedge clk) begin
        for(integer i=0; i<32; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<32; i=i+1) begin
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
module u_dcache_dram_b6_ram 
   (
   input logic [9:0] a,
   input logic  cen,
   input logic  clk,
   input logic [31:0] d,
   input logic  gwen,
   input logic [31:0] wen,
   output logic [31:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_dcache_dram_b6_ram sram
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
module sram_dcache_dram_b7_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [31:0] a_data_in,
   output logic [31:0] a_data_out,
   input logic [9:0] a_addr,
   input logic [31:0] a_wmask
   );

   logic [31:0] mem [0:1023];


    always_ff @(posedge clk) begin
        for(integer i=0; i<32; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<32; i=i+1) begin
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
module u_dcache_dram_b7_ram 
   (
   input logic [9:0] a,
   input logic  cen,
   input logic  clk,
   input logic [31:0] d,
   input logic  gwen,
   input logic [31:0] wen,
   output logic [31:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_dcache_dram_b7_ram sram
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
module sram_tlb_tram_way0_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [38:0] a_data_in,
   output logic [38:0] a_data_out,
   input logic [7:0] a_addr,
   input logic [38:0] a_wmask
   );

   logic [38:0] mem [0:255];


    always_ff @(posedge clk) begin
        for(integer i=0; i<39; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<39; i=i+1) begin
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
module u_tlb_tram_way0_ram 
   (
   input logic [7:0] a,
   input logic  cen,
   input logic  clk,
   input logic [38:0] d,
   input logic  gwen,
   input logic [38:0] wen,
   output logic [38:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_tlb_tram_way0_ram sram
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
module sram_tlb_tram_way1_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [38:0] a_data_in,
   output logic [38:0] a_data_out,
   input logic [7:0] a_addr,
   input logic [38:0] a_wmask
   );

   logic [38:0] mem [0:255];


    always_ff @(posedge clk) begin
        for(integer i=0; i<39; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<39; i=i+1) begin
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
module u_tlb_tram_way1_ram 
   (
   input logic [7:0] a,
   input logic  cen,
   input logic  clk,
   input logic [38:0] d,
   input logic  gwen,
   input logic [38:0] wen,
   output logic [38:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_tlb_tram_way1_ram sram
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
module sram_tlb_dram_way0_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [26:0] a_data_in,
   output logic [26:0] a_data_out,
   input logic [7:0] a_addr,
   input logic [26:0] a_wmask
   );

   logic [26:0] mem [0:255];


    always_ff @(posedge clk) begin
        for(integer i=0; i<27; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<27; i=i+1) begin
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
module u_tlb_dram_way0_ram 
   (
   input logic [7:0] a,
   input logic  cen,
   input logic  clk,
   input logic [26:0] d,
   input logic  gwen,
   input logic [26:0] wen,
   output logic [26:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_tlb_dram_way0_ram sram
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
module sram_tlb_dram_way1_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [26:0] a_data_in,
   output logic [26:0] a_data_out,
   input logic [7:0] a_addr,
   input logic [26:0] a_wmask
   );

   logic [26:0] mem [0:255];


    always_ff @(posedge clk) begin
        for(integer i=0; i<27; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<27; i=i+1) begin
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
module u_tlb_dram_way1_ram 
   (
   input logic [7:0] a,
   input logic  cen,
   input logic  clk,
   input logic [26:0] d,
   input logic  gwen,
   input logic [26:0] wen,
   output logic [26:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_tlb_dram_way1_ram sram
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
module sram_tlb_tram_way2_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [38:0] a_data_in,
   output logic [38:0] a_data_out,
   input logic [7:0] a_addr,
   input logic [38:0] a_wmask
   );

   logic [38:0] mem [0:255];


    always_ff @(posedge clk) begin
        for(integer i=0; i<39; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<39; i=i+1) begin
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
module u_tlb_tram_way2_ram 
   (
   input logic [7:0] a,
   input logic  cen,
   input logic  clk,
   input logic [38:0] d,
   input logic  gwen,
   input logic [38:0] wen,
   output logic [38:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_tlb_tram_way2_ram sram
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
module sram_tlb_dram_way2_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [26:0] a_data_in,
   output logic [26:0] a_data_out,
   input logic [7:0] a_addr,
   input logic [26:0] a_wmask
   );

   logic [26:0] mem [0:255];


    always_ff @(posedge clk) begin
        for(integer i=0; i<27; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<27; i=i+1) begin
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
module u_tlb_dram_way2_ram 
   (
   input logic [7:0] a,
   input logic  cen,
   input logic  clk,
   input logic [26:0] d,
   input logic  gwen,
   input logic [26:0] wen,
   output logic [26:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_tlb_dram_way2_ram sram
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
module sram_tlb_tram_way3_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [38:0] a_data_in,
   output logic [38:0] a_data_out,
   input logic [7:0] a_addr,
   input logic [38:0] a_wmask
   );

   logic [38:0] mem [0:255];


    always_ff @(posedge clk) begin
        for(integer i=0; i<39; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<39; i=i+1) begin
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
module u_tlb_tram_way3_ram 
   (
   input logic [7:0] a,
   input logic  cen,
   input logic  clk,
   input logic [38:0] d,
   input logic  gwen,
   input logic [38:0] wen,
   output logic [38:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_tlb_tram_way3_ram sram
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
module sram_tlb_dram_way3_ram 
   (
   input logic  clk,
   input logic  a_re,
   input logic  a_we,
   input logic [26:0] a_data_in,
   output logic [26:0] a_data_out,
   input logic [7:0] a_addr,
   input logic [26:0] a_wmask
   );

   logic [26:0] mem [0:255];


    always_ff @(posedge clk) begin
        for(integer i=0; i<27; i=i+1) begin
            if(a_we & a_wmask[i]) begin
                mem[a_addr][i*1 +: 1] <= a_data_in[i*1 +: 1];
            end
        end
        for(integer i=0; i<27; i=i+1) begin
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
module u_tlb_dram_way3_ram 
   (
   input logic [7:0] a,
   input logic  cen,
   input logic  clk,
   input logic [26:0] d,
   input logic  gwen,
   input logic [26:0] wen,
   output logic [26:0] q
   );

   logic  we;

  assign we = cen | wen & gwen;

    sram_tlb_dram_way3_ram sram
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

