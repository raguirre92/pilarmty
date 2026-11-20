import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CenterScrollLink } from "@/components/center-scroll-link";
import { CommunitiesPage } from "@/components/communities-page";
import { GivePage } from "@/components/give-page";
import { ContactForm } from "@/components/contact-form";
import { BeliefsAccordion } from "@/components/beliefs-accordion";
import { HomeCommunitiesSection } from "@/components/home-communities-section";
import { UpcomingEventsSection } from "@/components/upcoming-events-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VisitGatheringTimeline } from "@/components/visit-gathering-timeline";
import { localePath } from "@/lib/site";
import type { Locale } from "@/lib/types";

type PageSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
  itemHighlights?: string[][];
  images?: string[];
  link?: {
    label: string;
    href: string;
    external?: boolean;
  };
};

type PageContent = {
  eyebrow: string;
  title: string;
  intro: string[];
  seoTitle?: string;
  seoDescription?: string;
  heroImage?: string;
  sections: PageSection[];
  contact?: {
    title: string;
    body: string;
  };
  form?: boolean;
};

const esPages: Record<string, PageContent> = {
  conocenos: {
    eyebrow: "Conócenos",
    title: "Hola",
    intro: [
      "Somos Iglesia Pilar, una iglesia en el sur de Monterrey con la visión de ser una comunidad que vive y proclama fielmente el evangelio, haciendo discípulos para la renovación de nuestro entorno.",
      "Creemos en la centralidad del Evangelio, estamos cimentados en la Palabra, unidos en comunidad, comprometidos con el discipulado y siempre en misión. Existimos para glorificar a Dios a través del cumplimiento de la Gran Comisión: El evangelio para discipular y alcanzar.",
      "Si buscas una comunidad de fe donde el evangelio es creído, la Palabra es expuesta, el discipulado es esencial y la misión es retadora te invitamos a conocer más sobre nosotros."
    ],
    sections: [
      {
        title: "Nuestros Valores",
        paragraphs: [
          "Lo que creemos: nuestros cimientos de verdad que nos fundamenta."
        ],
        items: [
          "Centralidad del Evangelio",
          "Discipulado",
          "Cimentados en la Palabra",
          "Misionales",
          "Unidos en Comunidad"
        ],
        images: [
          "/images/wix/about/evangelio.webp",
          "/images/wix/about/discipulado.webp",
          "/images/wix/about/palabra.webp",
          "/images/wix/about/misionales.webp",
          "/images/wix/about/comunidad.webp"
        ]
      },
      {
        title: "El Cañón del Huajuco",
        paragraphs: [
          "La zona sur de nuestra ciudad de Monterrey, también conocida como Cañón del Huajuco está experimentando un gran crecimiento y desarrollo.",
          "Creemos firmemente que Dios nos ha llamado a este lugar estratégico para proclamar y vivir el Evangelio. Las buenas noticias de Jesús para todas las familias.",
          "Nuestro propósito es ser una iglesia saludable que enseñe la Biblia fielmente haciendo discípulos y alcanzando con la verdad del Evangelio a nuestra ciudad."
        ],
        images: ["/images/wix/about/huajuco.webp"]
      },
      {
        title: "Crecimiento en la zona sur de Monterrey",
        items: ["60,000 — Población en 2016", "200,000 — Población en 2025"]
      },
      {
        title: "Plantador",
        paragraphs: ["Sergio González", "y su familia"],
        images: ["/images/wix/about/sergio.webp"]
      },
      {
        title: "Equipo",
        images: ["/images/wix/about/equipo.webp"]
      }
    ],
    contact: {
      title: "Contáctanos",
      body: "Nos da gusto desees conocernos. Valoramos tus oraciones. Si tienes preguntas, quieres saber más de nosotros o simplemente quieres saludarnos, nos encantaría escucharte."
    }
  },
  visitanos: {
    eyebrow: "Iglesia Pilar",
    title: "Visítanos en Iglesia Pilar",
    intro: [
      "Únete a nuestros servicios que tenemos a lo largo de la semana y aprovecha estas oportunidades para juntos adorar a nuestro Dios, recordarnos el evangelio, orar los unos por los otros y tener comunidad."
    ],
    heroImage: "/images/wix/visit/hero.webp",
    sections: [
      {
        title: "Reunión General",
        paragraphs: ["Domingo - 5:00pm"]
      },
      {
        title: "Ubicación",
        paragraphs: [
          "Carretera Nacional",
          "Carretera Nacional 777D - KM 268, Monterrey, NL"
        ],
        link: {
          label: "Google Maps",
          href: "https://maps.app.goo.gl/BChPGge2rziXvgio6",
          external: true
        }
      },
      {
        title: "¿Qué sucede cuando nos reunimos?",
        paragraphs: [
          "Cuando nos reunimos, ponemos el evangelio al centro: cantamos las verdades de la Palabra, oramos juntos y abrimos la Palabra para crecer en discipulado y comunidad."
        ],
        items: [
          "Cantamos juntos para exaltar a Dios y recordar las verdades del Evangelio.",
          "Oramos como iglesia y ponemos nuestras necesidades delante de Dios.",
          "Abrimos la Biblia y somos expuestos al texto con claridad y aplicación.",
          "Hay clases para niños. Si lo prefieres, también pueden quedarse contigo.",
          "Al final convivimos para conocernos y caminar juntos en comunidad."
        ],
        itemHighlights: [
          ["Cantamos", "Dios", "Evangelio"],
          ["Oramos", "iglesia", "Dios"],
          ["Biblia", "texto"],
          ["niños"],
          ["convivimos", "comunidad"]
        ],
        images: [
          "/images/wix/visit/cantamos.webp",
          "/images/wix/visit/oramos.webp",
          "/images/wix/visit/biblia.webp",
          "/images/wix/visit/ninos.webp",
          "/images/wix/visit/comunidad.webp"
        ]
      },
      {
        title: "Comunidades Misionales",
        paragraphs: [
          "El discipulado se vive en comunidad",
          "para ser más como Cristo"
        ],
        items: ["Comunidad Sur"],
        link: {
          label: "Conoce más",
          href: "/comunidades"
        }
      }
    ],
    contact: {
      title: "Queremos Conocerte",
      body: "Si tienes preguntas, necesitas orientación, oración o solo quieres saludar, escríbenos y con gusto te respondemos."
    }
  },
  comunidades: {
    eyebrow: "Comunidades Misionales",
    title: "El discipulado se vive en comunidad",
    intro: ["para ser más como Cristo"],
    seoTitle: "Comunidades cristianas en Monterrey Sur | Iglesia Pilar",
    seoDescription:
      "Conoce las comunidades de Iglesia Pilar en Monterrey Sur: espacios para crecer en la Palabra, caminar con otros y vivir el evangelio en misión.",
    heroImage: "/images/wix/visit/comunidad.webp",
    sections: [
      {
        title: "Comunidad Sur"
      }
    ]
  },
  contactanos: {
    eyebrow: "Contáctanos",
    title: "Queremos Conocerte",
    intro: [
      "Si tienes preguntas, necesitas orientación, oración o solo quieres saludar, escríbenos y con gusto te respondemos."
    ],
    sections: [],
    form: true
  },
  dar: {
    eyebrow: "Dar",
    title: "Dar",
    intro: [
      "Damos porque Dios nos dio primero. Nuestras ofrendas son una respuesta de gratitud a su gracia y una manera práctica de participar en la misión de la iglesia."
    ],
    seoTitle: "Dar | Iglesia Pilar",
    seoDescription:
      "Conoce el fundamento bíblico de dar y las formas en que puedes contribuir a la misión de Iglesia Pilar.",
    sections: []
  }
};

const enPages: Record<string, PageContent> = {
  conocenos: {
    eyebrow: "About us",
    title: "Hello!",
    intro: [
      "We are Iglesia Pilar, a project that began in southern Monterrey. Our desire is to live and share the Gospel faithfully, so that more people may come to know Christ and, through His grace, He may renew our communities. We exist to give glory to God, seeking to make His truth known and His work transform lives in Monterrey."
    ],
    sections: [
      {
        title: "Our Values",
        paragraphs: ["What we believe: our foundation of truth that grounds us."],
        items: [
          "Centrality of the Gospel",
          "Discipleship",
          "Grounded in the Word",
          "Missionaries",
          "United in Community"
        ],
        images: [
          "/images/wix/about/evangelio.webp",
          "/images/wix/about/discipulado.webp",
          "/images/wix/about/palabra.webp",
          "/images/wix/about/misionales.webp",
          "/images/wix/about/comunidad.webp"
        ]
      },
      {
        title: "The Canyon of the Huajuco",
        paragraphs: [
          "The southern part of our city of Monterrey, also known as Huajuco Canyon, continues to experience significant growth and development.",
          "We firmly believe that God has called us to this strategic place to proclaim and live the Gospel: the good news of Jesus for all families.",
          "Our purpose is to be a healthy church that faithfully teaches the Bible, making disciples, and reaching our city with the truth of the Gospel."
        ],
        images: ["/images/wix/about/huajuco.webp"]
      },
      {
        title: "Growth in the southern area of Monterrey",
        items: ["60,000 — Population in 2016", "200,000 — Population in 2025"]
      },
      {
        title: "Planter",
        paragraphs: ["González Family"],
        images: ["/images/wix/about/sergio.webp"]
      },
      {
        title: "Team",
        images: ["/images/wix/about/equipo.webp"]
      }
    ],
    contact: {
      title: "Contact us",
      body: "We're glad you'd like to meet us. We appreciate your prayers. If you have questions, want to know more about us, or just want to say hello, we'd love to hear from you."
    }
  },
  visitanos: {
    eyebrow: "Visit us",
    title: "Visit us at Iglesia Pilar",
    intro: [
      "Join us for our services throughout the week and take advantage of these opportunities to worship our God together, remember the gospel, pray for one another, and build community."
    ],
    heroImage: "/images/wix/visit/hero.webp",
    sections: [
      {
        title: "Sunday Service",
        paragraphs: ["Sunday - 5:00pm"]
      },
      {
        title: "Location",
        paragraphs: [
          "Carretera Nacional",
          "Carretera Nacional 777D, KM 268, Monterrey, NL"
        ],
        link: {
          label: "Google Maps",
          href: "https://maps.app.goo.gl/BChPGge2rziXvgio6",
          external: true
        }
      },
      {
        title: "What happens when we meet?",
        paragraphs: [
          "When we gather, we put the gospel at the center: we sing to Christ, we pray together, and we open the Word to grow in discipleship and community."
        ],
        items: [
          "We sing together to exalt God and remember the truths of the Gospel.",
          "We pray as a church and place our needs before God.",
          "We open the Bible and are exposed to the Word with clarity and application.",
          "There are classes for children. If you prefer, they can also stay with you.",
          "In the end, we lived together to get to know each other and walk together as a community."
        ],
        itemHighlights: [
          ["sing", "God", "Gospel"],
          ["pray", "church", "God"],
          ["Bible", "Word"],
          ["children"],
          ["together", "community"]
        ],
        images: [
          "/images/wix/visit/cantamos.webp",
          "/images/wix/visit/oramos.webp",
          "/images/wix/visit/biblia.webp",
          "/images/wix/visit/ninos.webp",
          "/images/wix/visit/comunidad.webp"
        ]
      },
      {
        title: "Missionary Communities",
        paragraphs: [
          "Discipleship is lived in community",
          "to be more like Christ"
        ],
        items: ["Comunidad Sur"],
        link: {
          label: "Learn more",
          href: "/comunidades"
        }
      }
    ],
    contact: {
      title: "We want to Meet You",
      body: "If you have questions, need guidance, prayer, or just want to say hello, write to us and we will gladly respond."
    }
  },
  comunidades: {
    eyebrow: "Missionary Communities",
    title: "Discipleship is lived in community",
    intro: ["to be more like Christ"],
    seoTitle: "Christian communities in South Monterrey | Iglesia Pilar",
    seoDescription:
      "Discover Iglesia Pilar communities in South Monterrey: spaces to grow in the Word, walk with others, and live the gospel on mission.",
    heroImage: "/images/wix/visit/comunidad.webp",
    sections: [
      {
        title: "Comunidad Sur"
      }
    ]
  },
  contactanos: {
    eyebrow: "Contact us",
    title: "We want to Meet You",
    intro: [
      "If you have questions, need guidance, prayer, or just want to say hello, write to us and we will gladly respond."
    ],
    sections: [],
    form: true
  },
  dar: {
    eyebrow: "Give",
    title: "Give",
    intro: [
      "We give because God gave first. Our offerings are a response of gratitude to his grace and a practical way to take part in the church's mission."
    ],
    seoTitle: "Give | Iglesia Pilar",
    seoDescription:
      "Learn the biblical foundation for giving and the ways you can contribute to the mission of Iglesia Pilar.",
    sections: []
  }
};

export const staticPageSlugs = Object.keys(esPages);

export function getStaticPage(locale: Locale, slug: string) {
  return (locale === "es" ? esPages : enPages)[slug] || null;
}

const beliefReferences = [
  ["Salmo 19:7–10", "2 Timoteo 3:15–17", "2 Pedro 1:19–21"],
  ["Mateo 28:19", "Juan 4:24", "2 Corintios 13:14"],
  ["Génesis 3:6–24", "Romanos 3:9–19", "Efesios 2:1–3"],
  ["Juan 3:16", "Romanos 3:21–26", "Hebreos 7:25"],
  ["Romanos 4:4–5", "Romanos 5:1–2", "Filipenses 3:7–9"],
  ["Isaías 55:1", "Marcos 1:15", "Apocalipsis 22:17"],
  ["Juan 3:3–8", "2 Corintios 5:17", "Efesios 2:1–10"],
  ["Marcos 1:15", "Hechos 2:37–38", "Romanos 10:9–11"],
  ["Efesios 1:3–14", "Romanos 8:28–30", "2 Pedro 1:10–11"],
  ["1 Tesalonicenses 4:3", "2 Corintios 3:18", "Filipenses 2:12–13"],
  ["Juan 8:31", "Filipenses 1:6", "Judas 24–25"],
  ["Mateo 5:17", "Romanos 3:31", "Romanos 8:2–4"],
  ["Hechos 2:41–42", "Mateo 18:15–20", "1 Timoteo 3:1–13"],
  ["Mateo 28:19–20", "Romanos 6:4", "1 Corintios 11:23–28"],
  ["Mateo 19:4–6", "Salmo 127:3", "Salmo 139:13–16"],
  ["Romanos 13:1–7", "1 Timoteo 2:1–4", "Hechos 5:29"],
  ["Malaquías 3:18", "Juan 3:36", "Mateo 7:13–14"],
  ["1 Tesalonicenses 4:13–18", "Mateo 25:31–46", "Apocalipsis 20:11–12"]
];

function StaticSectionsList({
  locale,
  sections,
  startIndex = 0
}: {
  locale: Locale;
  sections: PageSection[];
  startIndex?: number;
}) {
  if (sections.length === 0) return null;

  return (
    <div className="values-list static-list">
      {sections.map((section, index) => (
        <article key={section.title}>
          <span>{String(startIndex + index + 1).padStart(2, "0")}</span>
          <h2>{section.title}</h2>
          <div className="static-section-copy">
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.items && (
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.images && (
              <div className="static-image-grid">
                {section.images.map((src) => (
                  <div className="static-image" key={src}>
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(max-width: 600px) 88vw, (max-width: 1000px) 42vw, 260px"
                    />
                  </div>
                ))}
              </div>
            )}
            {section.link &&
              (section.link.external ? (
                <a
                  className="text-link"
                  href={section.link.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {section.link.label} →
                </a>
              ) : (
                <Link
                  className="text-link"
                  href={localePath(locale, section.link.href)}
                >
                  {section.link.label} →
                </Link>
              ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function StaticContactSection({
  locale,
  contact
}: {
  locale: Locale;
  contact: NonNullable<PageContent["contact"]>;
}) {
  return (
    <section className="static-contact" id="contacto">
      <div>
        <p className="eyebrow">{contact.title}</p>
        <h2>{contact.title}</h2>
        <p>{contact.body}</p>
      </div>
      <ContactForm locale={locale} />
    </section>
  );
}

function VisitPage({
  locale,
  page
}: {
  locale: Locale;
  page: PageContent;
}) {
  const [serviceSection, locationSection, gatheringSection] = page.sections;
  const mapsLink = locationSection.link;
  const gatheringImageHeights = [1082, 720, 1080, 720, 720];
  const gatheringMoments = (gatheringSection.items ?? [])
    .map((item, index) => ({
      text: item,
      highlights: gatheringSection.itemHighlights?.[index] ?? [],
      image: gatheringSection.images?.[index] ?? "",
      width: 1080,
      height: gatheringImageHeights[index] ?? 720
    }))
    .filter((moment) => moment.image);
  const visitFaqs =
    locale === "es"
      ? {
          eyebrow: "Preguntas frecuentes",
          title: (
            <>
              Qué esperar en tu <em>visita</em>
            </>
          ),
          items: [
            {
              title: "¿Qué pasa en la reunión del domingo?",
              description:
                "Cantamos para exaltar a Dios, oramos juntos, abrimos la Biblia con claridad y aplicación, y al final convivimos para conocernos. El evangelio está en el centro de todo.",
              references: []
            },
            {
              title: "¿Cuánto dura el servicio?",
              description:
                "La reunión dura alrededor de 90 minutos. Al final te invitamos a que te quedes un rato para convivir, conocer a otras personas y, si lo deseas, conversar con alguien del equipo.",
              references: []
            },
            {
              title: "¿Puedo llevar a mis hijos?",
              description:
                "Sí. Hay clases para niños durante la reunión. Si prefieres que se queden contigo, también pueden hacerlo.",
              references: []
            },
            {
              title: "¿Cómo debo vestir?",
              description:
                "Ven como te sientas cómodo. No hay un código de vestimenta. Lo importante es que puedas venir con tranquilidad y concentrarte en adorar a Dios y escuchar su Palabra.",
              references: []
            },
            {
              title: "¿Dónde me estaciono?",
              description:
                "Hay estacionamiento en el auditorio, sobre Carretera Nacional. Si necesitas orientación al llegar, puedes acercarte a alguien del equipo de bienvenida.",
              references: []
            },
            {
              title: "¿Necesito avisar antes de ir?",
              description:
                "No es necesario registrarte. Puedes venir el domingo a las 5:00pm. Si prefieres, también puedes escribirnos antes y con gusto te orientamos.",
              references: []
            },
            {
              title: "¿Qué creen en Iglesia Pilar?",
              description:
                "Somos una iglesia evangélica que confía en la Biblia como autoridad suprema. Creemos en un solo Dios —Padre, Hijo y Espíritu Santo— y en la salvación por gracia mediante Jesucristo, recibida por fe y arrepentimiento. Creemos que la iglesia es una comunidad de creyentes bajo la Palabra de Dios, que observa el bautismo y la Cena del Señor, y que vive con la esperanza del regreso de Cristo.",
              references: [],
              link: {
                href: localePath(locale, "/conocenos#creencias"),
                label: "Ver lo que creemos"
              }
            }
          ]
        }
      : {
          eyebrow: "Frequently asked questions",
          title: (
            <>
              What to expect on your <em>visit</em>
            </>
          ),
          items: [
            {
              title: "What happens at the Sunday gathering?",
              description:
                "We sing to exalt God, pray together, open the Bible with clarity and application, and fellowship at the end. The gospel is at the center of everything.",
              references: []
            },
            {
              title: "How long is the service?",
              description:
                "The gathering lasts about 90 minutes. At the end, we invite you to stay awhile to fellowship, meet others, and talk with someone from the team if you would like.",
              references: []
            },
            {
              title: "Can I bring my children?",
              description:
                "Yes. There are classes for children during the gathering. If you prefer them to stay with you, they can do that as well.",
              references: []
            },
            {
              title: "What should I wear?",
              description:
                "Come as you feel comfortable. There is no dress code. What matters most is that you can arrive at peace and focus on worshiping God and hearing his Word.",
              references: []
            },
            {
              title: "Where do I park?",
              description:
                "There is parking at the auditorium on Carretera Nacional. If you need guidance when you arrive, someone from the welcome team can help you.",
              references: []
            },
            {
              title: "Do I need to let you know before coming?",
              description:
                "You do not need to register. You can come on Sunday at 5:00pm. If you prefer, you can also write to us beforehand and we will gladly orient you.",
              references: []
            },
            {
              title: "What does Iglesia Pilar believe?",
              description:
                "We are an evangelical church that trusts the Bible as the supreme authority. We believe in one God —Father, Son, and Holy Spirit— and in salvation by grace through Jesus Christ, received by faith and repentance. We believe the church is a community of believers under God's Word, observing baptism and the Lord's Supper, and living with the hope of Christ's return.",
              references: [],
              link: {
                href: localePath(locale, "/conocenos#creencias"),
                label: "See what we believe"
              }
            }
          ]
        };

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <section className="about-page-hero visit-page-hero">
          <div className="container">
            <div className="about-page-hero-inner visit-page-hero-inner">
              <div className="visit-page-hero-content">
                <div className="about-page-hero-copy">
                  <h1>
                    <span className="about-intro-headline">
                      {locale === "es" ? (
                        <>
                          <em>Visítanos</em> en Iglesia Pilar
                        </>
                      ) : (
                        <>
                          <em>Visit us</em> at Iglesia Pilar
                        </>
                      )}
                    </span>
                  </h1>
                  <div className="about-page-copy">
                    <p>{page.intro[0]}</p>
                  </div>
                </div>

                <div className="visit-page-info">
                  <div className="visit-page-info-block">
                    <h2>
                      <em>{serviceSection.title}</em>
                    </h2>
                    {serviceSection.paragraphs?.map((paragraph) => (
                      <p className="visit-page-info-detail" key={paragraph}>
                        {paragraph}
                      </p>
                    ))}
                    <CenterScrollLink className="button" href="#contacto">
                      {locale === "es" ? "Visítanos" : "Visit us"}
                    </CenterScrollLink>
                  </div>

                  <div className="visit-page-info-block">
                    <h2>
                      <em>{locationSection.title}</em>
                    </h2>
                    {locationSection.paragraphs?.map((paragraph, index) => (
                      <p
                        className={
                          index === 0
                            ? "visit-page-info-detail"
                            : "visit-page-info-address"
                        }
                        key={paragraph}
                      >
                        {paragraph}
                      </p>
                    ))}
                    {mapsLink && (
                      <a
                        className="button secondary"
                        href={mapsLink.href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {mapsLink.label}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {page.heroImage && (
                <div className="about-page-hero-media" data-parallax="0.05">
                  <Image
                    src={page.heroImage}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 960px) 100vw, 50vw"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <VisitGatheringTimeline
          title={gatheringSection.title}
          introduction={gatheringSection.paragraphs?.[0] ?? ""}
          moments={gatheringMoments}
        />

        <HomeCommunitiesSection locale={locale} />

        <UpcomingEventsSection locale={locale} />

        <section className="section visit-faq-section" data-reveal>
          <div className="container">
            <div className="communities-section-heading">
              <p className="eyebrow">{visitFaqs.eyebrow}</p>
              <h2>{visitFaqs.title}</h2>
            </div>
            <BeliefsAccordion beliefs={visitFaqs.items} locale={locale} />
          </div>
        </section>

        {page.contact && (
          <section className="section static-page-section visit-page-contact-section" data-reveal>
            <div className="container static-content">
              <StaticContactSection locale={locale} contact={page.contact} />
            </div>
          </section>
        )}
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

function AboutPage({ locale }: { locale: Locale }) {
  const beliefs =
    locale === "es"
      ? [
          {
            title: "Las Escrituras",
            description:
              "Creemos que la Biblia fue escrita por autores inspirados por Dios y que es un tesoro perfecto de instrucción divina, verdadero y sin error. Su propósito es mostrarnos la salvación y permanece como la autoridad suprema para evaluar nuestra conducta, nuestras convicciones y nuestra vida."
          },
          {
            title: "El Dios verdadero",
            description:
              "Creemos en un solo Dios vivo y verdadero, creador y soberano de todo, infinitamente santo y digno de nuestra confianza, amor y adoración. En la unidad de Dios existen eternamente el Padre, el Hijo y el Espíritu Santo, iguales en perfección divina y unidos en la obra de redención."
          },
          {
            title: "La caída del ser humano",
            description:
              "Creemos que la humanidad fue creada en santidad y en una relación correcta con Dios, pero cayó voluntariamente en pecado. Como consecuencia, todos nacemos inclinados al mal, separados de la santidad que Dios requiere y bajo su justa condenación, sin defensa ni excusa."
          },
          {
            title: "El camino de salvación",
            description:
              "Creemos que la salvación de los pecadores es completamente por gracia mediante Jesucristo, el Hijo de Dios, quien tomó nuestra naturaleza sin pecado y obedeció perfectamente. Por su muerte hizo expiación suficiente por nuestros pecados, resucitó y reina como Salvador compasivo y plenamente capaz de salvar."
          },
          {
            title: "La justificación",
            description:
              "Creemos que la justificación es la gran bendición por la cual Dios perdona y declara justos a quienes creen en Cristo. No depende de nuestras obras, sino de la fe en el Redentor y de su justicia perfecta, que nos concede paz con Dios, vida eterna y todo lo necesario para esta vida y la venidera."
          },
          {
            title: "La gratuidad de la salvación",
            description:
              "Creemos que las bendiciones de la salvación se ofrecen gratuitamente a todas las personas por medio del evangelio. Cada persona es llamada a recibirlas con una fe sincera, arrepentida y obediente; nada impide que el mayor pecador sea salvo excepto su rechazo voluntario de Cristo."
          },
          {
            title: "La gracia en la regeneración",
            description:
              "Creemos que para ser salvo es necesario nacer de nuevo. Esta regeneración es una obra del Espíritu Santo, realizada por medio de la verdad de Dios, que transforma el corazón y produce una respuesta voluntaria al evangelio; su evidencia aparece en el arrepentimiento, la fe y una vida renovada."
          },
          {
            title: "Arrepentimiento y fe",
            description:
              "Creemos que el arrepentimiento y la fe son deberes sagrados y gracias inseparables producidas por el Espíritu de Dios. Convencidos de nuestra culpa y necesidad, nos volvemos sinceramente a Dios, confesamos nuestro pecado y recibimos a Jesucristo como Profeta, Sacerdote y Rey, descansando solamente en Él."
          },
          {
            title: "El propósito de la gracia de Dios",
            description:
              "Creemos que Dios regenera, santifica y salva conforme a su propósito eterno y soberano, sin eliminar la responsabilidad humana ni los medios que Él ha establecido. Esta gracia excluye toda jactancia y produce humildad, amor, oración, alabanza, confianza en Dios y diligencia en la vida cristiana."
          },
          {
            title: "La santificación",
            description:
              "Creemos que la santificación es el proceso progresivo por el cual participamos de la santidad de Dios. Comienza en el nuevo nacimiento y continúa por la presencia y el poder del Espíritu Santo mediante la Palabra, la oración, la vigilancia, la negación propia y una vida de obediencia."
          },
          {
            title: "La perseverancia de los santos",
            description:
              "Creemos que los verdaderos creyentes perseveran en su unión con Cristo hasta el fin, y que esta perseverancia los distingue de una profesión de fe superficial. Dios cuida de ellos por su providencia y los guarda mediante la fe por su poder hasta la salvación final."
          },
          {
            title: "La ley y el evangelio",
            description:
              "Creemos que la ley de Dios es la norma santa, justa y buena de su gobierno moral. Nuestra incapacidad para obedecerla nace del amor al pecado; uno de los grandes propósitos del evangelio es librarnos de esa esclavitud y, por medio de Cristo, restaurarnos a una obediencia sincera."
          },
          {
            title: "La iglesia del evangelio",
            description:
              "Creemos que una iglesia visible de Cristo es una congregación de creyentes bautizados y unidos por pacto en la fe y la comunión del evangelio. La iglesia observa las ordenanzas de Cristo, vive bajo su Palabra y ejerce los dones, responsabilidades y privilegios que Él le ha confiado."
          },
          {
            title: "El bautismo y la Cena del Señor",
            description:
              "Creemos que el bautismo cristiano es la inmersión en agua de una persona creyente, como imagen de su unión con Cristo en su muerte, sepultura y resurrección. En la Cena del Señor, la iglesia recuerda junta el amor y la muerte de Cristo mediante el pan y la copa, después de examinarse a sí misma."
          },
          {
            title: "El Matrimonio y la Familia",
            description:
              "Creemos que Dios instituyó la familia como fundamento de la sociedad, unida por matrimonio, sangre o adopción. El matrimonio es el pacto de un hombre y una mujer para toda la vida, el marco bíblico para la intimidad sexual y la procreación. Los hijos, desde la concepción, son bendición y herencia del Señor."
          },
          {
            title: "El gobierno civil",
            description:
              "Creemos que el gobierno civil ha sido establecido para procurar el bienestar y el buen orden de la sociedad. Por ello debemos orar por quienes gobiernan, honrarlos y obedecerlos conscientemente, excepto cuando sus mandatos contradicen la voluntad de Jesucristo, Señor de la conciencia y Rey sobre toda autoridad."
          },
          {
            title: "Los justos y los injustos",
            description:
              "Creemos que existe una diferencia esencial entre los justos y los injustos. Solamente quienes han sido justificados por la fe en Jesucristo y santificados por el Espíritu son considerados justos delante de Dios; quienes permanecen sin arrepentirse y sin creer continúan bajo condenación, ahora y después de la muerte."
          },
          {
            title: "El mundo venidero",
            description:
              "Creemos que Cristo volverá desde el cielo y que los muertos resucitarán para comparecer ante el juicio final. Entonces habrá una separación definitiva: los injustos recibirán castigo eterno y los justos, gozo eterno; el juicio de Dios establecerá para siempre el destino de cada persona."
          }
        ].map((belief, index) => ({
          ...belief,
          references: beliefReferences[index]
        }))
      : [
          {
            title: "The Scriptures",
            description:
              "We believe the Bible was inspired by God, is true, and remains the supreme authority for our faith and life."
          },
          {
            title: "The true God",
            description:
              "We believe in one living and true God, creator and ruler, eternally existing as Father, Son, and Holy Spirit."
          },
          {
            title: "The fall of humanity",
            description:
              "We believe humanity was created in holiness but voluntarily fell into sin and came under just condemnation."
          },
          {
            title: "The way of salvation",
            description:
              "We believe salvation is entirely by grace through Jesus Christ, who died for our sins and rose again."
          },
          {
            title: "Justification",
            description:
              "We believe God forgives and declares righteous those who trust Christ, not by works but through the Redeemer's righteousness."
          },
          {
            title: "The freeness of salvation",
            description:
              "We believe the blessings of salvation are freely offered to all through the gospel and must be received by faith."
          },
          {
            title: "Grace in regeneration",
            description:
              "We believe the new birth is the work of the Holy Spirit and is evidenced by repentance, faith, and new life."
          },
          {
            title: "Repentance and faith",
            description:
              "We believe repentance and faith are inseparable graces by which we turn to God and rest in Christ alone."
          },
          {
            title: "God's purpose of grace",
            description:
              "We believe God regenerates, sanctifies, and saves according to his eternal purpose, excluding boasting and producing humility."
          },
          {
            title: "Sanctification",
            description:
              "We believe sanctification is the Holy Spirit's progressive work by which believers grow in holiness."
          },
          {
            title: "The perseverance of the saints",
            description:
              "We believe true believers endure to the end, kept by the power of God through faith."
          },
          {
            title: "The law and the gospel",
            description:
              "We believe God's law is holy, just, and good, and the gospel restores sinners to sincere obedience."
          },
          {
            title: "A gospel church",
            description:
              "We believe the local church is a congregation of baptized believers united by covenant in gospel faith and fellowship."
          },
          {
            title: "Baptism and the Lord's Supper",
            description:
              "We believe in believers' baptism by immersion and the Lord's Supper as the church's remembrance of Christ's love."
          },
          {
            title: "Marriage and family",
            description:
              "We believe God established the family as the foundation of society, united by marriage, blood, or adoption. Marriage is a lifelong covenant between one man and one woman, the biblical setting for sexual intimacy and procreation. Children, from conception, are a blessing and a heritage from the Lord."
          },
          {
            title: "Civil government",
            description:
              "We believe civil government serves social order and should be honored and obeyed except when it contradicts Jesus Christ."
          },
          {
            title: "The righteous and the wicked",
            description:
              "We believe there is an essential difference between those justified by faith and those who remain unrepentant."
          },
          {
            title: "The world to come",
            description:
              "We believe Christ will return, the dead will rise, and God's judgment will forever establish every person's final state."
          }
        ].map((belief, index) => ({
          ...belief,
          references: beliefReferences[index]
        }));

  const ministryPartners = [
    {
      name: "Familia de fe",
      href: "https://iglesiafamiliadefe.org/",
      logo: "/images/socios ministeriales/logofdf.avif"
    },
    {
      name: "Pillar Network",
      href: "https://thepillarnetwork.com/",
      logo: "/images/socios ministeriales/Artboard+1@2x.webp"
    },
    {
      name: "Connection",
      href: "https://siouxfallsconnection.com/home",
      logo: "/images/socios ministeriales/5180d7bf-f820-4332-80a6-6e7bdb008785@2x.png?v=2"
    }
  ];

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="about-page">
        <section className="about-page-hero">
          <div className="container about-page-hero-inner">
            <div className="about-page-hero-copy">
              <p className="about-intro-greeting">
                {locale === "es" ? "¡Hola!" : "Hello!"}
              </p>
              <h1>
                {locale === "es" ? (
                  <>
                    <span className="about-intro-headline">
                      Somos <strong>Iglesia Pilar</strong>
                    </span>
                    <span className="about-intro-tagline">
                      una <em>comunidad</em> que vive y proclama fielmente el{" "}
                      <em>evangelio</em>.
                    </span>
                  </>
                ) : (
                  <>
                    <span className="about-intro-headline">
                      We are <strong>Iglesia Pilar</strong>
                    </span>
                    <span className="about-intro-tagline">
                      a <em>community</em> that lives and faithfully proclaims
                      the <em>gospel</em>.
                    </span>
                  </>
                )}
              </h1>
            </div>
            <div className="about-page-hero-media" data-parallax="0.05">
              <Image
                src="/images/wix/about/huajuco.webp"
                alt={
                  locale === "es"
                    ? "Vista del Cañón del Huajuco"
                    : "View of Huajuco Canyon"
                }
                fill
                priority
                sizes="(max-width: 960px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        <section className="section about-pastor-section">
          <div className="container about-pastor-card" data-reveal>
            <div className="about-pastor-image">
              <Image
                src="/images/wix/about/sergio.webp"
                alt={
                  locale === "es"
                    ? "Sergio González, Pastor Principal de Iglesia Pilar"
                    : "Sergio González, Lead Pastor of Iglesia Pilar"
                }
                fill
                sizes="(max-width: 720px) 100vw, 44vw"
              />
            </div>
            <div className="about-pastor-copy">
              <p className="eyebrow">
                {locale === "es" ? "Nuestro pastor" : "Our pastor"}
              </p>
              <h2>Sergio González</h2>
              <div className="about-pastor-bio">
                {locale === "es" ? (
                  <>
                    <p>
                      Ingeniero industrial y de sistemas de profesión, Sergio
                      respondió al llamado del Señor a servirle de tiempo
                      completo. Desde el año 2004 ha servido en diferentes
                      ministerios e iglesias, como pastor de adolescentes y
                      jóvenes, co-pastor y administrador general.
                    </p>
                    <p>
                      Fue uno de los pastores de Familia de Fe, la iglesia que
                      lo envió a plantar Iglesia Pilar. También ha impartido
                      clases en diversos institutos bíblicos y colabora con el
                      Simeon Trust, un ministerio dedicado a entrenar a quienes
                      enseñan la Palabra.
                    </p>
                    <p>
                      Es Maestro en Estudios Teológicos por el Southern Baptist
                      Theological Seminary y actualmente sirve como Pastor
                      Principal de Iglesia Pilar.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      An industrial and systems engineer by profession, Sergio
                      answered the Lord&apos;s call to full-time ministry. Since
                      2004, he has served in various ministries and churches as
                      a youth and young adults pastor, co-pastor, and general
                      administrator.
                    </p>
                    <p>
                      He was one of the pastors at Familia de Fe, the church that
                      sent him to plant Iglesia Pilar. He has also taught at
                      various Bible institutes and collaborates with the Simeon
                      Trust, a ministry dedicated to training those who teach
                      God&apos;s Word.
                    </p>
                    <p>
                      He holds a Master of Arts in Theological Studies from The
                      Southern Baptist Theological Seminary and currently serves
                      as Lead Pastor of Iglesia Pilar.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="section about-beliefs-section" id="creencias">
          <div className="container" data-reveal>
            <div className="about-beliefs-heading">
              <p className="eyebrow">
                {locale === "es" ? "Nuestra fe" : "Our faith"}
              </p>
              <h2>
                {locale === "es" ? (
                  <>
                    Lo que <em>creemos</em>
                  </>
                ) : (
                  <>
                    What we <em>believe</em>
                  </>
                )}
              </h2>
            </div>
            <BeliefsAccordion beliefs={beliefs} locale={locale} />
          </div>
        </section>

        <section className="section about-partners-section">
          <div className="container" data-reveal>
            <div className="about-partners-heading">
              <h2>
                {locale === "es" ? (
                  <>
                    Socios <em>Ministeriales</em>
                  </>
                ) : (
                  <>
                    Ministry <em>partners</em>
                  </>
                )}
              </h2>
            </div>
            <div className="about-partners-grid">
              {ministryPartners.map((partner) => (
                <a
                  className="about-partner-link"
                  href={partner.href}
                  key={partner.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${partner.name} (${locale === "es" ? "abre en una pestaña nueva" : "opens in a new tab"})`}
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={360}
                    height={160}
                    sizes="(max-width: 720px) 80vw, 360px"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section about-visit-cta">
          <div className="container about-visit-cta-inner" data-reveal>
            <p className="eyebrow">
              {locale === "es" ? "Te damos la bienvenida" : "You are welcome"}
            </p>
            <h2>
              {locale === "es" ? (
                <>
                  Ven y conoce una comunidad <em>centrada en el evangelio.</em>
                </>
              ) : (
                <>
                  Come meet a community <em>centered on the gospel.</em>
                </>
              )}
            </h2>
            <p>
              {locale === "es"
                ? "Nos reunimos los domingos a las 5:00 p. m. en el sur de Monterrey."
                : "We gather Sundays at 5:00 p.m. in southern Monterrey."}
            </p>
            <Link className="button" href={localePath(locale, "/visitanos")}>
              {locale === "es" ? "Visítanos" : "Visit us"}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

export function StaticPage({
  locale,
  slug
}: {
  locale: Locale;
  slug: string;
}) {
  const page = getStaticPage(locale, slug);
  if (!page) notFound();
  if (slug === "conocenos") return <AboutPage locale={locale} />;
  if (slug === "visitanos") return <VisitPage locale={locale} page={page} />;
  if (slug === "comunidades") return <CommunitiesPage locale={locale} />;
  if (slug === "dar") return <GivePage locale={locale} />;

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <header className="page-hero static-hero">
          <div className="container page-hero-grid">
            <div>
              <p className="eyebrow">{page.eyebrow}</p>
              <h1>{page.title}</h1>
              <p className="lead">{page.intro[0]}</p>
            </div>
          </div>
        </header>
        <section className="section static-page-section">
          <div className="container static-content">
            {page.intro.length > 1 && (
              <div className="static-intro-copy">
                {page.intro.slice(1).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}
            <StaticSectionsList locale={locale} sections={page.sections} />
            {page.contact && (
              <StaticContactSection locale={locale} contact={page.contact} />
            )}
            {page.form && <ContactForm locale={locale} />}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
