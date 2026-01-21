import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from 'swagger-ui-express'

export const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API IMPLEMENTACAO ABACATEPAY Next.js",
            version: "1.0.0",
            description: "Documentação da API com Swagger",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
        tags: [
            { name: 'Health' },
            { name: 'Payments' },
        ],
        components: {
            schemas: {
                PaymentRequest: {
                    type: 'object',
                    required: ['nome', 'email', 'telefone', 'cpf'],
                    properties: {
                        nome: { type: 'string', example: 'Thiago Yukio' },
                        email: { type: 'string', example: 'thiago@gmail.com' },
                        telefone: { type: 'string', example: '48993215632' },
                        cpf: { type: 'string', example: '29072293037' },
                    }
                }
            }
        },
        paths: {
            '/api/health': {
                get: {
                    tags: ['Health'],
                    summary: 'Verificação com a conexão do banco de dados',
                    responses: {
                        200: { description: 'OK' }
                    }
                }
            },
            '/api/payments': {
                get: {
                    tags: ['Payments'],
                    summary: 'Lista todas as cobranças do banco de dados',
                    responses: {
                        200: { description: 'OK' },
                        500: { error: 'Erro interno no pagamento' }
                    }
                },
                post: {
                    tags: ['Payments'],
                    summary: 'Lista todas as cobranças do banco de dados',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/PaymentRequest'
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: 'OK' },
                        500: { error: 'Erro interno no pagamento' }
                    }
                }
            },
        },
    },

    apis: [], // caminhos das rotas
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

export function setupSwagger(app: any) {
    app.get('/docs.json', (_req: any, res: any) => res.json(swaggerSpec));
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
