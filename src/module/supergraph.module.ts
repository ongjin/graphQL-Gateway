import { ApolloGateway, GatewayConfig, IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig, AuthenticationError, ValidationError } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import {
    formatError,
    GQLAPI_NAME,
    GQLAPI_URL,
    WEBKIOSK_NAME,
    WEBKIOSK_URL
} from 'src/shared';
import { GraphQLModule } from '@nestjs/graphql';


@Module({
    imports: [
        GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
            driver: ApolloGatewayDriver,
            server: {
                formatError,
                context: ({ req }) => {
                    return { headers: req.headers };
                },
                // context: supergraphContext,
                playground: true,
                // csrfPrevention: false,
                introspection: true,
                // path: '/service1/graphql'
            },

            gateway: {
                buildService: ({ name, url }) => {
                    // const { name, url } = serviceList
                    return new RemoteGraphQLDataSource({
                        url,
                        willSendRequest({ request, context }) {
                            request.http.headers.set('Authorization', context?.['headers']?.['authorization'] || '');
                            request.http.headers.set('Content-Type', 'application/json');
                            console.log({ name, url });
                        },
                        // didReceiveResponse: ({ response, request }) => {
                        //     // 응답을 가로채고 수정하는 로직 구현
                        //     // 헤더에 'x-custom-header'가 'some-value'인 경우 응답 변경
                        //     response.data = {
                        //         ...response.data,
                        //         customField: 'Custom Value',
                        //     };

                        //     return response;
                        // },
                        // process: async ({ request }) => {
                        //     console.log({ request });

                        //     // 요청을 처리하기 전에 추가적인 로직을 수행할 수 있습니다.
                        //     // 예를 들어, 인증이나 권한 검사 등을 수행할 수 있습니다.

                        //     return request;
                        // },
                        // parseBody: async (response, requestContext) => {
                        //     console.log(response);

                        //     // 응답을 파싱하기 전에 추가적인 로직을 수행할 수 있습니다.
                        //     // 예를 들어, 응답 데이터를 변환하거나 가공할 수 있습니다.

                        //     return response;
                        // },
                    });
                },
                supergraphSdl: new IntrospectAndCompose({
                    subgraphs: [
                        { name: GQLAPI_NAME, url: GQLAPI_URL },
                        { name: WEBKIOSK_NAME, url: WEBKIOSK_URL },
                        // { name: 'webkiosk', url: 'http://172.28.0.2:3001/graphql' },
                    ],
                    subgraphHealthCheck: false,
                }),
                serviceHealthCheck: false,
            },
        }),
    ]
})

export class SupergraphModule { }



