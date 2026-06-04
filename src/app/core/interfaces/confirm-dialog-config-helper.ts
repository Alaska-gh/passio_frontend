import { PrimeNgSeverity } from "./primeng-severity.enums";

export function getConfirmDialogConfig(confirmType: PrimeNgSeverity) {
  switch (confirmType.toLowerCase()) {
    case 'danger':
      return {
        icon: 'fas fa-exclamation-triangle',
        acceptButtonStyleClass: 'p-button-danger'
      };
    case 'warning':
      return {
        icon: 'fas fa-circle-exclamation',
        acceptButtonStyleClass: 'p-button-warning'
      };
    case 'info':
      return {
        icon: 'fas fa-circle-info',
        acceptButtonStyleClass: 'p-button-info'
      };
    default:
      return {
        icon: 'fas fa-circle-question',
        acceptButtonStyleClass: 'p-button-primary'
      };
  }
}
