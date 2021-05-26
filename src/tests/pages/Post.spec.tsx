import { render, screen } from '@testing-library/react';
import { stripe } from '../../services/stripe';
import { mocked } from 'ts-jest/utils';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';
import { getSession } from 'next-auth/client';

const post = {
    slug: 'my-new-post',
    title: 'My New Post',
    content: '<p>Post excerpt</p>',
    updatedAt: 'March, 10'
};

jest.mock('next-auth/client')
jest.mock('../../services/prismic');

describe('Post page', () => {
    it('renders corretly', () => {

        render(<Post post={post} />)

        expect(screen.getByText('My New Post')).toBeInTheDocument();
        expect(screen.getByText('Post excerpt')).toBeInTheDocument();
    })

    it('redirects user if no subscription is found', async () => {
        const getSessionMocked = mocked(getSession);

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: null
        } as null);

        const response = await getServerSideProps({
            params: {
                slug: 'my-new-post'
            }
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            })
        );

    })

    it('loads initial data', async () => {
        const getSessionMocked = mocked(getSession);
        const getPrismicClientMocked = mocked(getPrismicClient);

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as null);

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [{ type: 'heading', text: 'My New Post' }],
                    content: [{ type: 'paragraph', text: 'Post Content' }]
                },
                last_publication_date: '04-01-2021'
            })
        } as any)

        const response = await getServerSideProps({
            params: {
                slug: 'my-new-post'
            }
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'My New Post',
                        content: '<p>Post Content</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        );

    })

});