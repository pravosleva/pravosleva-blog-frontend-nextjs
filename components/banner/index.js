import dynamic from 'next/dynamic';


const DynamicComponentWithNoSSR = dynamic(() => import('./banner'), {
  ssr: false
})

export default ({ articles }) => (
  <>
    <DynamicComponentWithNoSSR articles={articles} />
  </>
);
