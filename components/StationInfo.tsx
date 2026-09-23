import type { Lang, StationDef, StationState } from "@/lib/types";
import { strings } from "@/lib/strings";
import { otherLang, stationPath } from "@/lib/seo";
import styles from "./StationInfo.module.css";

/**
 * Server-rendered text under the map: the live status of every unit, a short
 * FAQ, and a link to the other language. The map itself is graphics, so this is
 * what search engines (and screen-reader users) read.
 */
export function StationInfo({
  station,
  lang,
  state,
}: {
  station: StationDef;
  lang: Lang;
  state: StationState | null;
}) {
  const t = strings(lang);
  const alt = otherLang(lang);

  return (
    <section className={styles.info}>
      <h2 className={styles.title}>{t.unitsTitle}</h2>
      <p className={styles.text}>{t.unitsIntro(station.name)}</p>
      <ul className={styles.units}>
        {station.units.map((u) => {
          const s = state?.units[u.id];
          const status = s?.status ?? "ok";
          const word =
            status === "out"
              ? t.out
              : status === "ok"
                ? t.working
                : s?.last?.kind === "out"
                  ? t.unsureOut
                  : t.unsureOk;
          return (
            <li key={u.id}>
              <i className={styles.dot} data-status={status} aria-hidden />
              <span>
                <strong>{u.name[lang]}</strong> ({u.sub[lang]}): {word}
              </span>
            </li>
          );
        })}
      </ul>

      <h2 className={styles.title}>{t.faqTitle}</h2>
      {t.faq.map((f) => (
        <div key={f.q}>
          <h3 className={styles.question}>{f.q}</h3>
          <p className={styles.text}>{f.a}</p>
        </div>
      ))}

      <p className={styles.text}>
        <a href={stationPath(station.slug, alt)} hrefLang={alt} lang={alt}>
          {t.switchLang}
        </a>
      </p>
    </section>
  );
}
