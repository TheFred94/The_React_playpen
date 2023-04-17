import Image from "next/image";
import Head from "next/head";

export default function Henry({ data }) {
  // You could also do like this to avoid writing data. in front of all content properties
  const { content } = data;
  return (
    <>
      <Head>
        <title>{content.title}</title>
      </Head>
      <h1>{content.heading}</h1>
      <p>{content.text}</p>
      <Image src={content.image.src} alt={content.image.alt} width={content.image.width} height={content.image.height} sizes="(max-width: 750px) 100vw, 750px"></Image>
    </>
  );
}

export async function getStaticProps() {
  const api = "https://bucolic-bombolone-857476.netlify.app/api/dogs/henry";
  const res = await fetch(api);
  const data = await res.json();
  console.log(data);

  return {
    props: {
      data,
    },
  };
}
