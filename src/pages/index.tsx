import { createOrder, CreateOrderParams } from "@/api/order";
import { createPayment } from "@/api/payment";
import { createSpecies, CreateSpeciesParams } from "@/api/species";
import CreateOrderDialog from "@/components/CreateOrderDialog";
import CreateSpeciesDialog from "@/components/CreateSpeciesDialog";
import { useMyOrders } from "@/queries/order";
import { signout } from "@/utils/firebase";
import { Button, List, ListItemButton, ListItemText } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef } from "react";

export default function Home() {
  const router = useRouter();
  const createOrderDialogRef =
    useRef<React.ElementRef<typeof CreateOrderDialog>>(null);
  const createSpeciesDialogRef =
    useRef<React.ElementRef<typeof CreateSpeciesDialog>>(null);
  const queryClient = useQueryClient();
  const { data: myOrders, isLoading: isLoadingMyOrders } = useMyOrders();
  const createSpeciesMutation = useMutation(createSpecies, {
    onSuccess: () => {
      queryClient.invalidateQueries(["species"]);
    },
  });

  const createOrderMutation = useMutation(createOrder);

  const initiatePaymentMutation = useMutation(createPayment, {
    onSuccess: (_, variables) => {
      router.push({
        pathname: "/payment",
        query: {
          paymentId: variables.paymentId,
        },
      });
    },
  });

  const handleCreatePayment = async (paymentId: string) => {
    await initiatePaymentMutation.mutateAsync({ paymentId });
  };

  const handleCreateSpecies = async (newSpeciesData: CreateSpeciesParams) => {
    await createSpeciesMutation.mutateAsync({ ...newSpeciesData });
  };

  const handleCreateOrders = async (newOrderData: CreateOrderParams) => {
    await createOrderMutation.mutateAsync({ ...newOrderData });
  };

  const handleSignout = async () => {
    await signout();
  };
  console.log(myOrders);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Hello</h1>
      <Button onClick={() => createOrderDialogRef.current?.open()}>
        Create Order
      </Button>
      <Button onClick={() => createSpeciesDialogRef.current?.open()}>
        Create Species
      </Button>
      <Button onClick={handleSignout}>Sign out</Button>
      <List component="nav" aria-label="secondary mailbox folder">
        {myOrders?.map((order) => {
          return (
            <ListItemButton onClick={() => handleCreatePayment(order.payment)}>
              <ListItemText>{order._id}</ListItemText>
            </ListItemButton>
          );
        })}
      </List>
      <CreateOrderDialog
        ref={createOrderDialogRef}
        handleCreateOrder={handleCreateOrders}
      />
      <CreateSpeciesDialog
        ref={createSpeciesDialogRef}
        handleCreateSpecies={handleCreateSpecies}
      />
    </>
  );
}