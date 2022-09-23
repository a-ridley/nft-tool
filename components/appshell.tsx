import { ReactElement, useState } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Button,
  Space,
} from '@mantine/core';
import { ClientCreateForm } from './clientCreateForm';
import Link from 'next/link';

export const AppShellDemo = (props: {
  children: ReactElement | ReactElement[]
}) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <ClientCreateForm />
        </Navbar>
      }
      aside={
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
            <Link href="/sendHbarForm" passHref>
              <Button component="a">
                Send HBAR
              </Button>
            </Link>
            <Space h="md" />
            <Link href="/sendNftForm" passHref>
              <Button component="a">
                Send NFTs
              </Button>
            </Link>
            <Space h="md" />
            <Link href="/mintNftForm" passHref>
              <Button component="a">
                Mint NFTs
              </Button>
            </Link>
            <Space h="md" />
            <Link href="/mintNftToExisitingCollectionForm" passHref>
              <Button component="a">
                Mint NFTs To Existing Collection
              </Button>
            </Link>
          </Aside>
        </MediaQuery>
      }
      // footer={
      //   <Footer height={60} p="md">
      //     Application footer
      //   </Footer>
      // }
      header={
        <Header height={70} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Text>NFT Tool</Text>
          </div>
        </Header>
      }
    >
      {props.children}
    </AppShell>
  );
}