OPENQASM 3.0;
gate f2 q0,q1 // -4 15
{
h q0;
h q1;
z q0;
z q1;
cz q0,q1;
h q0;
h q1;
}
gate f1 q0,q1 // -2 10
{
cz q0,q1;
}
gate f0 q0,q1 // -2 5
{
h q0;
h q1;
}
// 3 6 this function prepares the search space
// 3 11 this function adds a negative phase to a state
// 3 12 (in this case: |11>)
// 4 16 this function amplifies the coefficient
// 4 17 of the state with negative phase
// -1 -5 An Example of Grover's Algorithm
// -3 -3 This algorithm amplifies the chance of measuring a certain 
// -3 -2 state from a big list of possible states
// 3 7 (in this case: a full superposition)
qubit q[2]; // 2 1
f0 q[0],q[1];
f1 q[0],q[1];
f2 q[0],q[1];
