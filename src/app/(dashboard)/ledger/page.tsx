import { getPartners } from '@/lib/services/partners'
import { PartnerCard } from '@/components/partners/partner-card'

export const dynamic = 'force-dynamic'

export default async function LedgerPage() {
    const partners = await getPartners()

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Partner Ledger</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {partners.map(partner => (
                    <PartnerCard key={partner.id} partner={partner} />
                ))}

                {partners.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No partners found.
                    </div>
                )}
            </div>
        </div>
    )
}
