import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

const supergraphContext = ({ req }) => {
    // Determine the subgraph based on the request information
    let subgraph: any;

    if (req.headers['x-subgraph'] === 'Member') {
        subgraph = 'Member';
    } else {
        subgraph = 'astems';
    }

    // Return the subgraph information as part of the context
    return { subgraph };
};

const supergraphGatewayConfig = {
    supergraphSdl: new IntrospectAndCompose({
        subgraphs: [
            { name: 'Member', url: 'http://localhost:3030/graphql' },
            // { name: 'astems', url: 'http://www.astems.co.kr:15000/graphql' },
        ],
    }),
    buildService: ({ url, subgraph }) => {
        console.log('subgraph', subgraph);
        
        return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }) {
                // Set the 'x-subgraph' header to specify the subgraph
                request.http.headers.set('x-subgraph', subgraph);
                request.http.headers.set('Authorization', context?.['headers']?.['authorization']);
                request.http.headers.set('Content-Type', 'application/json');
            },
        });
    },
};

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
                        // { name: 'Member', url: 'http://localhost:3030/graphql' },
                        // { name: 'astems', url: 'http://www.astems.co.kr:15000/graphql' },
                        { name: 'astems', url: 'http://localhost:3000/graphql' },
                        { name: 'astems', url: 'http://172.28.0.2:3001/graphql' },
                    ],
                }),

                buildService: ({ url, name }) => {
                    console.log('name', name, 'url', url);
                    
                    return new RemoteGraphQLDataSource({
                        url,
                        willSendRequest({ request, context }) {
                            // request.http.headers.set('Authorization', context?.headers?.authorization);
                            request.http.headers.set('Authorization', context?.['headers']?.['authorization'] || '');
                            request.http.headers.set('Content-Type', 'application/json');
                        },
                    });
                },
            },
        }),
    ]
})





export class AppModule { }
