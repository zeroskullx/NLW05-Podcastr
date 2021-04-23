import "../styles/global.scss";
import styles from "../styles/app.module.scss";
import clsx from 'clsx';

import { Hearder } from "../components/Header";
import { Player } from "../components/Player";
import { PlayerProvider } from "../contexts/PlayerContext";

function MyApp({ Component, pageProps }) {
  return (
    <PlayerProvider>
      <div className={clsx(styles.wrapper, 'd-flex')}>
        <main>
          <Hearder />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerProvider>
  );
}

export default MyApp;
