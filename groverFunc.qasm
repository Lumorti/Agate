OPENQASM 3.0;
gate f1 q0,q1 // -2 11
{
h q0;
h q1;
z q0;
z q1;
cz q0,q1;
h q0;
h q1;
}
gate f0 q0,q1 // -2 6
{
cz q0,q1;
}
qubit q[2]; // -1 2
h q[0];
h q[1];
f0 q[0],q[1];
f1 q[0],q[1];
