import { Button, Table, Title } from '@mantine/core';

const AccountsPage = () => {
  const rows = [
    { email: 'admin@example.com', role: 'admin' },
    { email: 'user1@example.com', role: 'user' },
  ];

  return (
    <div>
      <Title order={3}>Accounts</Title>
      <Table striped withTableBorder mt="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((r) => (
            <Table.Tr key={r.email}>
              <Table.Td>{r.email}</Table.Td>
              <Table.Td>{r.role}</Table.Td>
              <Table.Td>
                <Button size="xs" variant="light">Edit</Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default AccountsPage;
