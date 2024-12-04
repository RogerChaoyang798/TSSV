package AIGC_DEMO_reg_pkg;

// =============================================================================
// Register bit field definition
// =============================================================================

typedef struct packed {
  logic [31: 0] ID;
} UNIT_ID_t;

typedef struct packed {
  logic ctrl3;
  logic [6:0] res_1;
  logic [15: 0] ctrl2;
  logic [4:0] res_0;
  logic ctrl1;
  logic [1: 0] ctrl0;
} CTRL_t;

typedef struct packed {
  logic [6:0] res_1;
  logic m2_clear;
  logic [15:0] res_0;
  logic [3: 0] m1_clr;
  logic [3: 0] m0_clr;
} CFG0_t;

typedef struct packed {
  logic [7: 0] bus1_prdy;
  logic [7: 0] bus1_pvld;
  logic [7: 0] bus0_prdy;
  logic [7: 0] bus0_pvld;
} DEBUG_0_t;

typedef struct packed {
  logic [31: 0] status;
} DEBUG_1_t;

typedef struct packed {
  logic [31: 0] dummy_debug;
} DUMMY_DEBUG_t;

typedef struct packed {
  logic [31: 0] status_reg;
} STASUS_REG_t;

endpackage : AIGC_DEMO_reg_pkg
