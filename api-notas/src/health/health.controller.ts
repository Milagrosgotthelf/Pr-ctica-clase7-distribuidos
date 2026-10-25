import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
    @Get()
    @ApiOperation({
        summary: 'Verificar estado del servicio',
        description: 'Endpoint de liveness probe para balanceadores o clientes HTTP.',
    })
    @ApiOkResponse({ schema: { example: { estado: 'ok' } } })
    check() {
        return { estado: 'ok' };
    }
}