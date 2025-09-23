import { Request, Response, NextFunction } from 'express';
import {
    ValidationRule,
    ValidationMessages,
    ValidationErrors,
    ValidatedRequest,
    ValidationRuleFunction
} from '../types/validation.types';

abstract class FormRequest {
    protected req: ValidatedRequest;
    protected res: Response;
    protected next: NextFunction;
    protected errors: ValidationErrors = {};

    constructor(req: ValidatedRequest, res: Response, next: NextFunction) {
        this.req = req;
        this.res = res;
        this.next = next;
    }

    abstract rules(): ValidationRule;

    messages(): ValidationMessages {
        return {};
    }

    async authorize(): Promise<boolean> {
        return true;
    }

    protected transform(): any {
        return this.getValidatedData();
    }

    async validate(): Promise<void> {
        try {
            if (!(await this.authorize())) {
                this.res.status(403).json({
                    error: 'Forbidden',
                    message: 'Você não tem permissão para realizar esta ação'
                });
                return;
            }

            const rules = this.rules();
            const customMessages = this.messages();

            for (const [field, fieldRules] of Object.entries(rules)) {
                const value = this.getFieldValue(field);
                const rulesArray = Array.isArray(fieldRules)
                    ? fieldRules
                    : fieldRules.split('|').filter(rule => rule.trim());

                for (const rule of rulesArray) {
                    const error = await this.validateRule(field, value, rule, customMessages);
                    if (error) {
                        if (!this.errors[field]) {
                            this.errors[field] = [];
                        }
                        this.errors[field].push(error);
                        break;
                    }
                }
            }

            if (Object.keys(this.errors).length > 0) {
                this.res.status(422).json({
                    error: 'Validation Error',
                    message: 'Os dados fornecidos são inválidos',
                    errors: this.errors
                });
                return;
            }

            this.req.validated = this.transform();

            this.next();
        } catch (error) {
            console.error('Erro na validação:', error);
            this.res.status(500).json({
                error: 'Internal Server Error',
                message: 'Erro interno do servidor'
            });
        }
    }

    protected getFieldValue(field: string): any {
        const keys = field.split('.');
        let value: any = {
            ...this.req.body,
            ...this.req.query,
            ...this.req.params
        };

        for (const key of keys) {
            value = value && value[key];
        }

        return value;
    }

    // Obter todos os dados validados
    protected getValidatedData(): any {
        const rules = this.rules();
        const validatedData: any = {};

        for (const field of Object.keys(rules)) {
            const value = this.getFieldValue(field);
            if (value !== undefined) {
                this.setNestedValue(validatedData, field, value);
            }
        }

        return validatedData;
    }

    // Helper para definir valores aninhados
    private setNestedValue(obj: any, path: string, value: any): void {
        const keys = path.split('.');
        let current = obj;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }

        current[keys[keys.length - 1]] = value;
    }

    // Validar uma regra específica
    private async validateRule(
        field: string,
        value: any,
        rule: string,
        customMessages: ValidationMessages
    ): Promise<string | null> {
        const [ruleName, ...ruleParams] = rule.split(':');
        const param = ruleParams.join(':');

        switch (ruleName.toLowerCase()) {
            case 'required':
                return this.validateRequired(field, value, customMessages);

            case 'string':
                return this.validateString(field, value, customMessages);

            case 'email':
                return this.validateEmail(field, value, customMessages);

            case 'min':
                return this.validateMin(field, value, param, customMessages);

            case 'max':
                return this.validateMax(field, value, param, customMessages);

            case 'numeric':
                return this.validateNumeric(field, value, customMessages);

            case 'integer':
                return this.validateInteger(field, value, customMessages);

            case 'in':
                return this.validateIn(field, value, param, customMessages);

            case 'confirmed':
                return this.validateConfirmed(field, value, customMessages);

            case 'array':
                return this.validateArray(field, value, customMessages);

            case 'boolean':
                return this.validateBoolean(field, value, customMessages);

            case 'date':
                return this.validateDate(field, value, customMessages);

            case 'url':
                return this.validateUrl(field, value, customMessages);

            case 'regex':
                return this.validateRegex(field, value, param, customMessages);

            case 'unique':
                return await this.validateUnique(field, value, param, customMessages);

            default:
                const customMethod = (this as any)[`validate${ruleName.charAt(0).toUpperCase() + ruleName.slice(1)}`];
                if (typeof customMethod === 'function') {
                    const error = await customMethod.call(this, field, value, param);
                    if (error) {
                        return customMessages[`${field}.${ruleName}`] || error;
                    }
                }
                break;
        }

        return null;
    }

    private validateRequired(field: string, value: any, messages: ValidationMessages): string | null {
        if (value === undefined || value === null || value === '' ||
            (Array.isArray(value) && value.length === 0)) {
            return messages[`${field}.required`] || `O campo ${field} é obrigatório`;
        }
        return null;
    }

    private validateString(field: string, value: any, messages: ValidationMessages): string | null {
        if (value !== undefined && typeof value !== 'string') {
            return messages[`${field}.string`] || `O campo ${field} deve ser uma string`;
        }
        return null;
    }

    private validateEmail(field: string, value: any, messages: ValidationMessages): string | null {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return messages[`${field}.email`] || `O campo ${field} deve ser um email válido`;
        }
        return null;
    }

    private validateMin(field: string, value: any, param: string, messages: ValidationMessages): string | null {
        const minValue = parseInt(param);
        if (value && value.length < minValue) {
            return messages[`${field}.min`] || `O campo ${field} deve ter pelo menos ${minValue} caracteres`;
        }
        return null;
    }

    private validateMax(field: string, value: any, param: string, messages: ValidationMessages): string | null {
        const maxValue = parseInt(param);
        if (value && value.length > maxValue) {
            return messages[`${field}.max`] || `O campo ${field} deve ter no máximo ${maxValue} caracteres`;
        }
        return null;
    }

    private validateNumeric(field: string, value: any, messages: ValidationMessages): string | null {
        if (value !== undefined && value !== '' && isNaN(Number(value))) {
            return messages[`${field}.numeric`] || `O campo ${field} deve ser um número`;
        }
        return null;
    }

    private validateInteger(field: string, value: any, messages: ValidationMessages): string | null {
        if (value !== undefined && value !== '' && !Number.isInteger(Number(value))) {
            return messages[`${field}.integer`] || `O campo ${field} deve ser um número inteiro`;
        }
        return null;
    }

    private validateIn(field: string, value: any, param: string, messages: ValidationMessages): string | null {
        const allowedValues = param.split(',').map(v => v.trim());
        if (value && !allowedValues.includes(String(value))) {
            return messages[`${field}.in`] || `O campo ${field} deve ser um dos valores: ${allowedValues.join(', ')}`;
        }
        return null;
    }

    private validateConfirmed(field: string, value: any, messages: ValidationMessages): string | null {
        const confirmationField = `${field}_confirmation`;
        const confirmationValue = this.getFieldValue(confirmationField);
        if (value !== confirmationValue) {
            return messages[`${field}.confirmed`] || `A confirmação do campo ${field} não confere`;
        }
        return null;
    }

    private validateArray(field: string, value: any, messages: ValidationMessages): string | null {
        if (value !== undefined && !Array.isArray(value)) {
            return messages[`${field}.array`] || `O campo ${field} deve ser um array`;
        }
        return null;
    }

    private validateBoolean(field: string, value: any, messages: ValidationMessages): string | null {
        if (value !== undefined && typeof value !== 'boolean' &&
            !['true', 'false', '1', '0', 1, 0].includes(value)) {
            return messages[`${field}.boolean`] || `O campo ${field} deve ser um valor booleano`;
        }
        return null;
    }

    private validateDate(field: string, value: any, messages: ValidationMessages): string | null {
        if (value && isNaN(Date.parse(value))) {
            return messages[`${field}.date`] || `O campo ${field} deve ser uma data válida`;
        }
        return null;
    }

    private validateUrl(field: string, value: any, messages: ValidationMessages): string | null {
        if (value) {
            try {
                new URL(value);
            } catch {
                return messages[`${field}.url`] || `O campo ${field} deve ser uma URL válida`;
            }
        }
        return null;
    }

    private validateRegex(field: string, value: any, param: string, messages: ValidationMessages): string | null {
        if (value && !new RegExp(param).test(value)) {
            return messages[`${field}.regex`] || `O campo ${field} tem formato inválido`;
        }
        return null;
    }

    private async validateUnique(field: string, value: any, param: string, messages: ValidationMessages): Promise<string | null> {
        return null;
    }

    static middleware<T extends FormRequest>(
        FormRequestClass: new (req: ValidatedRequest, res: Response, next: NextFunction) => T
    ) {
        return async (req: ValidatedRequest, res: Response, next: NextFunction): Promise<void> => {
            const formRequest = new FormRequestClass(req, res, next);
            await formRequest.validate();
        };
    }

    static getValidatedData(req: ValidatedRequest): any {
        return req.validated || {};
    }
}

export default FormRequest;