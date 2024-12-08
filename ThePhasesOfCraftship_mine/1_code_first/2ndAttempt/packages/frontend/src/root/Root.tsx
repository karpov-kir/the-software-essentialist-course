import "@mantine/notifications/styles.css";
import "@mantine/core/styles.css";

import { createTheme, LoadingOverlay, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useAtom } from "jotai";
import { ReactElement, useEffect, useState } from "react";

import { ApiClient } from "../ApiClient";
import { currentUserAtom } from "./currentUserAtom";

const theme = createTheme({});

const useInitialize = () => {
  const [, setCurrentUser] = useAtom(currentUserAtom);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    new ApiClient()
      .me()
      .then((fetchedUser) => {
        setCurrentUser(fetchedUser);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Failed to fetch current user", error);
        setIsLoading(false);
      });
  }, [setCurrentUser]);

  return { isLoading };
};

export function Root({ children }: { children: ReactElement }) {
  const { isLoading } = useInitialize();

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications />
      {isLoading ? <LoadingOverlay visible={true} /> : children}
    </MantineProvider>
  );
}
