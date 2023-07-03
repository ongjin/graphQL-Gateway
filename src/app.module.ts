import { Module } from '@nestjs/common';
import { SupergraphModule } from './module';


@Module({
    imports: [
        SupergraphModule,
    ]
})


export class AppModule { }
