// Entry point required by the MakeCode package checker.
// Executable feature coverage is split across the independent projects in tests/
// so each V1/V2 firmware remains representative and below the device size limit.
let sarduMatrixTestEntryPassed = true;
if (!sarduMatrixTestEntryPassed) control.panic(921);
