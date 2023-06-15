import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

const map = {
    asd:{ name: 'astemsapi', url: 'http://localhost:3030/graphql' },
}

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
            driver: ApolloGatewayDriver,
            server: {
                context: ({ req }) => {
                    return { headers: req.headers };
                },
                playground: true,
                csrfPrevention: false,
            },
            gateway: {
                supergraphSdl: new IntrospectAndCompose({
                    subgraphs: [
                        { name: 'Member', url: 'http://localhost:3030/graphql' },
                        // { name: 'astems', url: 'http://www.astems.co.kr:15000/graphql' },
                    ],
                }),

                buildService: ({ url }) => {
                    return new RemoteGraphQLDataSource({
                        url,
                        // willSendRequest({ request, context }) {
                        //     request.http.headers.set(
                        //         'authorization',
                        //         context?.['headers']?.['authorization'],
                        //     );
                        //     request.http.headers.set(
                        //         'Content-Type',
                        //         'application/json'
                        //     );
                        // },
                        willSendRequest({ request, context }) {
                            request.http.headers.set('authorization', context?.['headers']?.['authorization']);
                            // request.http.headers.set('Content-Type', 'application/json');
                        },
                    });
                },
            },
        }),
    ]
})




export class AppModule { }
