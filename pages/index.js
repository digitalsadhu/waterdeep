import Head from 'next/head';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';
import sanity from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url'

const client = sanity({
    projectId: 'egyeqt5c',
    dataset: 'production',
    token: '', // or leave blank to be anonymous user
    useCdn: true // `false` if you want to ensure fresh data
});

const builder = imageUrlBuilder(client);

function urlFor(source) {
    return builder.image(source);
}

const Map = dynamic(() => import('../components/map'), { ssr: false });

export default function Home(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Waterdeep</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
   integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
   crossOrigin=""/>
      </Head>
      <main className={styles.main}>
        <Map {...props} />
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  const locations = await client.fetch(`
      *[_type == "location"]{
          _id,
          name,
          description,
          story,
          image,
          location,
          characters[]->{
            _id,
            name,
            player->,
            short,
            image,
            race->,
            class->,
            subclass->,
            labels[]->,
            pc,
            description,
          },
          labels[]->
      }`
  );
  return {
    props: {
      locations: locations.map(location => {
        if (location.image) {
          location.image = urlFor(location.image).width(500).url();
        }
        if (location.characters) {
          location.characters.map(character => {
            if (character.image) {
              character.image = urlFor(character.image).width(80).url();
            }
          });
        }
        return location;
      }),
    },
  }
}