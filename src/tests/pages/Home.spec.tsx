import { render, screen } from '@testing-library/react';
import Home from '../../pages';

jest.mock('next/router');
jest.mock('next-auth/client', () => {
    return {
        useSession: () => [null, false]
    }
});

describe('Home page', () => {
    it('renders corretly', () => {

        render(<Home product={{ priceId: 'fakePriceId', amount: 'R$10,00' }} />)

        expect(screen.getByText('for R$10,00 month')).toBeInTheDocument();
    })
})