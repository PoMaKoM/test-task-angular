import {Injectable} from '@angular/core';
import {NgbDateParserFormatter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
    readonly DELIMITER = '.';

    parse(value: string): NgbDateStruct | null {
        if (value) {
            const date = value.split(this.DELIMITER);
            return {
                day: parseInt(date[0], 10),
                month: parseInt(date[1], 10),
                year: parseInt(date[2], 10),
            };
        }
        return null;
    }

    format(date: NgbDateStruct | null): string {
        if (date) {
            const normalizedDay = date.day.toString().padStart(2, '0');
            const normalizedMonth = date.month.toString().padStart(2, '0');
            return normalizedDay + this.DELIMITER + normalizedMonth + this.DELIMITER + date.year
        } else {
            return '';
        }
    }
}
