import { UserDto } from "@dddforum/shared/dist/dtos/UserDto";
import {
  ActionIcon,
  AppShell,
  Button,
  Container,
  Flex,
  Group,
  Image,
  MantineStyleProp,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { Link, useLocation, useNavigate } from "react-router";

import { Gravatar } from "../components/Gravatar";
import bricksImageUrl from "../images/bricks.png";
import { currentUserAtom } from "./currentUserAtom";
import classNames from "./RootLayout.module.css";

function Logo() {
  const linkWrapperStyles: MantineStyleProp = {
    textDecoration: "none",
    color: "var(--mantine-color-text)",
  };

  return (
    <Flex align="center" component={Link} to="/" style={linkWrapperStyles}>
      <Image h={50} src={bricksImageUrl} pr="md" />
      <Flex direction="column" pr="md">
        <Text size="xl" fw="bold" td="none">
          DDD forum
        </Text>
        <Text visibleFrom="sm">Where awesome Domain-Driven Designers are made</Text>
      </Flex>
    </Flex>
  );
}

function SignedInSection({ currentUser }: { currentUser: UserDto }) {
  const navigate = useNavigate();
  const [, setCurrentUser] = useAtom(currentUserAtom);

  const handleSignOut = () => {
    setCurrentUser(undefined);
    navigate("/sign-in");
    localStorage.removeItem("accessToken");
  };
  return (
    <Group gap="xs">
      <Tooltip label={currentUser.username} position="bottom" color="gray" withArrow>
        <Gravatar email={currentUser.email} size={30} />
      </Tooltip>
      <ActionIcon w={40} variant="transparent" onClick={handleSignOut}>
        <IconLogout />
      </ActionIcon>
    </Group>
  );
}

function Header() {
  const location = useLocation();
  const [currentUser] = useAtom(currentUserAtom);
  const isSignInPage = location.pathname === "/sign-in";
  const isSignUpPage = location.pathname === "/sign-up";
  const isSignInButtonHidden = currentUser || isSignInPage || isSignUpPage;

  return (
    <Container size="lg" w="100%">
      <Flex justify="space-between" align="center">
        <Logo />
        {currentUser && <SignedInSection currentUser={currentUser} />}
        {!isSignInButtonHidden && (
          <Button variant="light" component={Link} to="/sign-in" display={currentUser ? "none" : undefined}>
            Sign in
          </Button>
        )}
      </Flex>
    </Container>
  );
}

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      header={{
        height: 70,
      }}
    >
      <AppShell.Header className={classNames.header}>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg" w="100%" mt="lg" mb="lg">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
