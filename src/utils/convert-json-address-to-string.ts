export function formatAddress(addressString: string): string {
  if (!addressString) return "";

  try {
    const address = JSON.parse(addressString);

    const parts = [
      address.address && address.number
        ? `${address.address}, ${address.number}`
        : address.address || "",

      address.complement,
      address.reference ? `- ${address.reference}` : null,

      address.district,
      address.city && address.state
        ? `${address.city} - ${address.state}`
        : address.city || address.state || "",

      address.zipCode,
    ];

    // Filtra valores nulos, vazios ou undefined, e junta com vírgula
    return parts.filter(Boolean).join(", ");
  } catch {
    return "";
  }
}
