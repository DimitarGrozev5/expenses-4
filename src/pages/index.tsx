import {
  type InferGetServerSidePropsType,
  type GetServerSidePropsContext,
  type NextPage,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";

import { authOptions } from "~/server/auth";

import Card from "~/components/layout/card";
import Button from "~/components/layout/button";
import { useEffect } from "react";

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ signedIn, providers }) => {
  const router = useRouter();

  useEffect(() => {
    if (signedIn) void router.push("/budget");
  }, [router, signedIn]);

  return (
    <>
      <Head>
        <title>Expenses</title>
      </Head>
      <Card>
        Expenses is an app that helps you track your personal expenses.
        It&apos;s meant to be used exlusively by the developer of the app and is
        not maintained to a standard that would make it usable and secure for
        the wider public. Use at your own risk.
      </Card>
      <Card>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <Button fullWidth onClick={() => void signIn(provider.id)}>
              Sign in with {provider.name}
            </Button>
          </div>
        ))}
      </Card>
    </>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const providers = await getProviders();

  return {
    props: { signedIn: !!session, providers: providers ?? [] },
  };
}
