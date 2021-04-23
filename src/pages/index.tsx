import { useContext } from 'react';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import clsx from 'clsx';
import Link from 'next/link';

import styles from './home.module.scss';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { formatTimeToString } from '../util/formatTimeToString';
import { PlayerContext } from '../contexts/PlayerContext';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
}

type HomeProps = {
  allEpisodes: Episode[];
  latestEpisodes: Episode[];
}

export default function Home(props: HomeProps) {

  const { playList } = useContext(PlayerContext);

  const { allEpisodes, latestEpisodes } = props;

  const epsodeList = [...latestEpisodes, ...allEpisodes];


  return (
    <div className={clsx(styles.homeContainer)}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={clsx(styles.latestEpisodes)} >
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image width={192} height={192} src={episode.thumbnail} alt={episode.title} objectFit="cover" />
                <div className={clsx(styles.episodeDetails)}>
                  <Link href={`/episodes/${episode.id}`} >
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => playList(epsodeList, index)} >
                  <img src="/images/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={clsx(styles.allEpidodes)} >

        <h2>Todos episódios</h2>

        <table cellSpacing={0} >
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image width={120} height={120} src={episode.thumbnail} alt={episode.title} objectFit="cover" />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`} >
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 110 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playList(epsodeList, index + latestEpisodes.length)}>
                      <img src="/images/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

      </section>

    </div>
  );
}

//SPA, SSR, SSG
//SSG sever side generation
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: formatTimeToString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      allEpisodes,
      latestEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}