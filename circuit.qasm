OPENQASM 3.0;
gate f1 q0
{
z q0;
}
gate f0 q0
{
x q0;
}
qubit q[1];
f0 q[0];
f1 q[0];
