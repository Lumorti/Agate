OPENQASM 3.0;
gate f1 q0,q1
{
cx q1,q0;
}
gate f0 q0
{
x q0;
}
qubit q[3];
cf0 q[2],q[0];
i q[1];
f0 q[1];
cf1 q[2],q[0],q[1];
