import { MatInput, MatHint, MatLabel, MatError, MatFormField } from "@angular/material/input";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatButton } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatTab, MatTabBody, MatTabGroup, MatTabContent } from "@angular/material/tabs";
import { MatToolbar } from "@angular/material/toolbar";
import { MatSelect, MatOption} from "@angular/material/select";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator } from "@angular/material/paginator";
import { MatRadioButton, MatRadioGroup } from "@angular/material/radio";
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardImage, MatCardSubtitle, MatCardTitle } from "@angular/material/card";
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { MatChipSet, MatChip, MatChipListbox, MatChipOption } from "@angular/material/chips";
import { MatBadge } from "@angular/material/badge";


export function importMatComponents() {    
    return [
        MatInput, MatHint, MatLabel, MatError, MatFormField,
        MatButton,
        MatTableModule, MatPaginator,
        MatCheckbox,
        MatSelect, MatOption,
        MatSnackBarModule,
        MatRadioButton, MatRadioGroup,
        MatGridList, MatGridTile, 
        MatCard, MatCardContent, MatCardImage, MatCardActions, MatCardTitle, MatCardHeader, MatCardSubtitle,MatCardFooter,
        MatChipSet, MatChip, MatChipListbox, MatChipOption,
        MatBadge
    ];
}

export function importAppHeaderComponents() {
    return [
        MatTab, MatTabBody, MatTabGroup, MatTabContent,
        MatToolbar,
        MatButton
    ];
}

export function importMapDialogrComponents() {
    return [
        MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButton
    ];
}