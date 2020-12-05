OPENQASM 3.0;
gate f2 q0,q1
{
h q0;
h q1;
z q0;
z q1;
cz q0,q1;
h q0;
h q1;
}
gate f1 q0,q1
{
cz q0,q1;
}
gate f0 q0,q1
{
h q0;
h q1;
}
qubit q[2];
f0 q[0],q[1];
f1 q[0],q[1];
f2 q[0],q[1];
