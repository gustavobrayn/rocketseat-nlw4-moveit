import { useEffect, useState } from "react";
import { providers, signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";

import styles from "../styles/pages/Login.module.css";

export default function Login({ providers }) {
  const router = useRouter();
  const [session, loading] = useSession();
  const [username, setUsername] = useState("");

  useEffect(() => {
    session && router.push("/");
  }, [session]);

  return (
    <div className={styles.container}>
      <div>
        <header>
          <img src="/images/logo-white.png" alt="Move it" />
        </header>

        <strong>Bem-vindo</strong>
        <section>
          <img src="/icons/github.png" alt="Github icon" />
          Faça login com seu Github para começar
        </section>
        <footer>
          <input
            type="text"
            placeholder="Digite seu username"
            onChange={(e) => setUsername(e.target.value)}
          />
          {providers &&
            Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <button onClick={() => signIn(provider.id)}>
                  Sign in with {provider.name}
                </button>
              </div>
            ))}
          <button
            type="button"
            style={
              !!username
                ? { background: "#4CD62B", transition: "background-color 0.2s" }
                : {}
            }
          >
            <img src="/icons/arrow-right.png" alt="Arrow to right" />
          </button>
        </footer>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      providers: await providers(),
    },
  };
}
