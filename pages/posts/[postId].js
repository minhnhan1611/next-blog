import Format from '../../layout/Format'
import Author from '../../components/_child/Author'
import Image from 'next/image'
import getPost from '../../lib/Helper'
import fetcher from '../../lib/Fetcher';
import Spinner from '../../components/_child/Spinner'
import ErrorComponent from '../../components/_child/Error'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import Related from '@/components/_child/Related'

export default function Page({ fallback }) {

    const router = useRouter()
    const { postId } = router.query;
    const { data, isLoading, isError } = fetcher(`api/posts/${postId}`)

    if (isLoading) return <Spinner></Spinner>
    if (isError) return <ErrorComponent></ErrorComponent>

    return (
        <SWRConfig value={{ fallback }}>
            <Article {...data}></Article>
        </SWRConfig>
    )

}

function Article({ title, img, subtitle, description, author }) {

    return (
        <Format>
            <section className='container mx-auto md:px-2 py-16 w-1/2'>
                <div className='flex justify-center'>
                    {author ? <Author {...author}></Author> : <></>}
                </div>

                <div className="post py-10">
                    <h1 className='font-bold text-4xl text-center pb-5'>{title || "No Title"}</h1>

                    <p className='text-gray-500 text-xl text-center'>{subtitle || "No Title"}</p>

                    <div className="py-10">
                        <Image src={img || "/"} width={900} height={600}></Image>
                    </div>

                    <div className="content text-gray-600 text-lg flex flex-col gap-4">
                        {description || "No Description"}
                    </div>

                </div>

                <Related />
            </section>
        </Format>
    )
}


export async function getStaticProps({ params }) {
    const posts = await getPost(params.postId)

    return {
        props: {
            fallback: {
                '/api/posts': posts
            }
        }
    }
}

export async function getStaticPaths() {
    const posts = await getPost();
    const paths = posts.map(value => {
        return {
            params: {
                postId: value.id.toString()
            }
        }
    })

    return {
        paths,
        fallback: false
    }

}