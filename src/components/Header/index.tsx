import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';

import styles from "./styles.module.scss";
import clsx from 'clsx';

export function Hearder() {

    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR
    });

    return (
        <header className={clsx(styles.headerContainer, "d-flex", "align-items-center")}>
            <Link href="/">
                <a>
                    <img src="/images/logo.svg" alt="Podcastr" />
                </a>
            </Link>

            <p>O melhor para você ouvir, sempre</p>

            <span>{currentDate}</span>
        </header>
    )
}