import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGateway } from '@apollo/gateway';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
    imports: [
        GraphQLModule.forRootAsync({
            driver: ApolloDriver,
            useFactory: async () => {
                const gateway = new ApolloGateway({
                    serviceList: [
                        { name: 'GQL_API', url: 'http://localhost:3030/graphql' },
                        // 다른 서비스도 필요한 경우 여기에 추가
                    ],
                });


                await gateway.load();

                return {
                    gateway,
                    autoSchemaFile: true,
                    introspection: true,
                    playground: true,
                };
            },
        }),
    ],
})

export class SupergraphModule { }



