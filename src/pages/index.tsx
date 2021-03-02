import Head from "next/head";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

import { ChallengeBox } from "../components/ChallengeBox";
import { CompletedChallenges } from "../components/CompletedChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from "../components/Profile";
import { CountdownProvider } from "../contexts/CountdownContext";

import styles from "../styles/pages/Home.module.css";
import { ChallengeProvider } from "../contexts/ChallengesContext";
import { useEffect } from "react";

interface HomeProps {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

export default function Home(props: HomeProps) {
  const [session, loading] = useSession();
  const router = useRouter();
  const { level, currentExperience, challengesCompleted } = props;

  useEffect(() => {
    if (!session && !loading) {
      router.push("/login");
    }
  }, [session, loading]);

  return (
    <ChallengeProvider
      level={level}
      currentExperience={currentExperience}
      challengesCompleted={challengesCompleted}
    >
      <div className={styles.container}>
        <Head>
          <title>Inicio | move.it</title>
        </Head>
        <ExperienceBar />

        <CountdownProvider>
          <section>
            <div>
              <Profile />
              <CompletedChallenges />
              <Countdown />
            </div>
            <div>
              <ChallengeBox />
            </div>
          </section>
        </CountdownProvider>
      </div>
    </ChallengeProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { level, currentExperience, challengesCompleted } = ctx.req.cookies;

  return {
    props: {
      level: Number(level),
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted),
    },
  };
};
