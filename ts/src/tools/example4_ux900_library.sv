
        

        

        
/* verilator lint_off WIDTH */        
module sram_core0_w0_shw_tram_bus 
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
module u_core0_w0_shw_tram_bus 
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

    sram_core0_w0_shw_tram_bus sram
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
module sram_core0_w1_shw_tram_bus 
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
module u_core0_w1_shw_tram_bus 
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

    sram_core0_w1_shw_tram_bus sram
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
module sram_core1_w0_shw_tram_bus 
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
module u_core1_w0_shw_tram_bus 
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

    sram_core1_w0_shw_tram_bus sram
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
module sram_core1_w1_shw_tram_bus 
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
module u_core1_w1_shw_tram_bus 
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

    sram_core1_w1_shw_tram_bus sram
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
module sram_core2_w0_shw_tram_bus 
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
module u_core2_w0_shw_tram_bus 
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

    sram_core2_w0_shw_tram_bus sram
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
module sram_core2_w1_shw_tram_bus 
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
module u_core2_w1_shw_tram_bus 
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

    sram_core2_w1_shw_tram_bus sram
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
module sram_core3_w0_shw_tram_bus 
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
module u_core3_w0_shw_tram_bus 
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

    sram_core3_w0_shw_tram_bus sram
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
module sram_core3_w1_shw_tram_bus 
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
module u_core3_w1_shw_tram_bus 
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

    sram_core3_w1_shw_tram_bus sram
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
module sram_l2c_w0_b0_tram 
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
module u_l2c_w0_b0_tram 
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

    sram_l2c_w0_b0_tram sram
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
module sram_l2c_w1_b0_tram 
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
module u_l2c_w1_b0_tram 
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

    sram_l2c_w1_b0_tram sram
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
module sram_l2c_w2_b0_tram 
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
module u_l2c_w2_b0_tram 
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

    sram_l2c_w2_b0_tram sram
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
module sram_l2c_w3_b0_tram 
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
module u_l2c_w3_b0_tram 
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

    sram_l2c_w3_b0_tram sram
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
module sram_l2c_w4_b0_tram 
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
module u_l2c_w4_b0_tram 
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

    sram_l2c_w4_b0_tram sram
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
module sram_l2c_w5_b0_tram 
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
module u_l2c_w5_b0_tram 
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

    sram_l2c_w5_b0_tram sram
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
module sram_l2c_w6_b0_tram 
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
module u_l2c_w6_b0_tram 
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

    sram_l2c_w6_b0_tram sram
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
module sram_l2c_w7_b0_tram 
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
module u_l2c_w7_b0_tram 
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

    sram_l2c_w7_b0_tram sram
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
module sram_l2c_w8_b0_tram 
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
module u_l2c_w8_b0_tram 
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

    sram_l2c_w8_b0_tram sram
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
module sram_l2c_w9_b0_tram 
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
module u_l2c_w9_b0_tram 
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

    sram_l2c_w9_b0_tram sram
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
module sram_l2c_w10_b0_tram 
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
module u_l2c_w10_b0_tram 
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

    sram_l2c_w10_b0_tram sram
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
module sram_l2c_w11_b0_tram 
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
module u_l2c_w11_b0_tram 
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

    sram_l2c_w11_b0_tram sram
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
module sram_l2c_w12_b0_tram 
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
module u_l2c_w12_b0_tram 
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

    sram_l2c_w12_b0_tram sram
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
module sram_l2c_w13_b0_tram 
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
module u_l2c_w13_b0_tram 
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

    sram_l2c_w13_b0_tram sram
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
module sram_l2c_w14_b0_tram 
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
module u_l2c_w14_b0_tram 
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

    sram_l2c_w14_b0_tram sram
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
module sram_l2c_w15_b0_tram 
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
module u_l2c_w15_b0_tram 
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

    sram_l2c_w15_b0_tram sram
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
module sram_l2c_b0_aram 
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
module u_l2c_b0_aram 
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

    sram_l2c_b0_aram sram
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
module sram_l2c_w0_b1_tram 
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
module u_l2c_w0_b1_tram 
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

    sram_l2c_w0_b1_tram sram
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
module sram_l2c_w1_b1_tram 
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
module u_l2c_w1_b1_tram 
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

    sram_l2c_w1_b1_tram sram
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
module sram_l2c_w2_b1_tram 
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
module u_l2c_w2_b1_tram 
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

    sram_l2c_w2_b1_tram sram
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
module sram_l2c_w3_b1_tram 
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
module u_l2c_w3_b1_tram 
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

    sram_l2c_w3_b1_tram sram
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
module sram_l2c_w4_b1_tram 
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
module u_l2c_w4_b1_tram 
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

    sram_l2c_w4_b1_tram sram
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
module sram_l2c_w5_b1_tram 
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
module u_l2c_w5_b1_tram 
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

    sram_l2c_w5_b1_tram sram
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
module sram_l2c_w6_b1_tram 
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
module u_l2c_w6_b1_tram 
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

    sram_l2c_w6_b1_tram sram
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
module sram_l2c_w7_b1_tram 
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
module u_l2c_w7_b1_tram 
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

    sram_l2c_w7_b1_tram sram
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
module sram_l2c_w8_b1_tram 
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
module u_l2c_w8_b1_tram 
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

    sram_l2c_w8_b1_tram sram
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
module sram_l2c_w9_b1_tram 
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
module u_l2c_w9_b1_tram 
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

    sram_l2c_w9_b1_tram sram
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
module sram_l2c_w10_b1_tram 
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
module u_l2c_w10_b1_tram 
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

    sram_l2c_w10_b1_tram sram
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
module sram_l2c_w11_b1_tram 
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
module u_l2c_w11_b1_tram 
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

    sram_l2c_w11_b1_tram sram
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
module sram_l2c_w12_b1_tram 
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
module u_l2c_w12_b1_tram 
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

    sram_l2c_w12_b1_tram sram
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
module sram_l2c_w13_b1_tram 
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
module u_l2c_w13_b1_tram 
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

    sram_l2c_w13_b1_tram sram
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
module sram_l2c_w14_b1_tram 
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
module u_l2c_w14_b1_tram 
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

    sram_l2c_w14_b1_tram sram
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
module sram_l2c_w15_b1_tram 
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
module u_l2c_w15_b1_tram 
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

    sram_l2c_w15_b1_tram sram
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
module sram_l2c_b1_aram 
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
module u_l2c_b1_aram 
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

    sram_l2c_b1_aram sram
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
module sram_l2c_b0_ck0_dram 
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
module u_l2c_b0_ck0_dram 
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

    sram_l2c_b0_ck0_dram sram
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
module sram_l2c_b0_ck1_dram 
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
module u_l2c_b0_ck1_dram 
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

    sram_l2c_b0_ck1_dram sram
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
module sram_l2c_b0_ck2_dram 
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
module u_l2c_b0_ck2_dram 
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

    sram_l2c_b0_ck2_dram sram
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
module sram_l2c_b0_ck3_dram 
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
module u_l2c_b0_ck3_dram 
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

    sram_l2c_b0_ck3_dram sram
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
module sram_l2c_b0_ck4_dram 
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
module u_l2c_b0_ck4_dram 
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

    sram_l2c_b0_ck4_dram sram
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
module sram_l2c_b0_ck5_dram 
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
module u_l2c_b0_ck5_dram 
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

    sram_l2c_b0_ck5_dram sram
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
module sram_l2c_b0_ck6_dram 
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
module u_l2c_b0_ck6_dram 
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

    sram_l2c_b0_ck6_dram sram
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
module sram_l2c_b0_ck7_dram 
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
module u_l2c_b0_ck7_dram 
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

    sram_l2c_b0_ck7_dram sram
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
module sram_l2c_b1_ck0_dram 
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
module u_l2c_b1_ck0_dram 
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

    sram_l2c_b1_ck0_dram sram
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
module sram_l2c_b1_ck1_dram 
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
module u_l2c_b1_ck1_dram 
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

    sram_l2c_b1_ck1_dram sram
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
module sram_l2c_b1_ck2_dram 
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
module u_l2c_b1_ck2_dram 
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

    sram_l2c_b1_ck2_dram sram
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
module sram_l2c_b1_ck3_dram 
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
module u_l2c_b1_ck3_dram 
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

    sram_l2c_b1_ck3_dram sram
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
module sram_l2c_b1_ck4_dram 
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
module u_l2c_b1_ck4_dram 
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

    sram_l2c_b1_ck4_dram sram
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
module sram_l2c_b1_ck5_dram 
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
module u_l2c_b1_ck5_dram 
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

    sram_l2c_b1_ck5_dram sram
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
module sram_l2c_b1_ck6_dram 
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
module u_l2c_b1_ck6_dram 
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

    sram_l2c_b1_ck6_dram sram
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
module sram_l2c_b1_ck7_dram 
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
module u_l2c_b1_ck7_dram 
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

    sram_l2c_b1_ck7_dram sram
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

