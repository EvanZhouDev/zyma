import tls from 'node:tls';
import { X509Certificate } from 'node:crypto';

// The affected trust paths are listed at https://emudhra.we-have-a-problem.com/roots.json.
const affected = new Set([
  '7DD78D5F4F13459A83DFF9ABBBA62EDBAF6F2D102BF257FD712F4D9F2746ED8D',
  'F2EDAAFF3D9B701FB4D14C9F285F8C0BAD90FC3BCC1FA07D47F4718EDABA34A5',
  'D7A7A0FB5D7E2731D771E9484EBCDEF71D5F0C3E0A2948782BC83EE0EA699EF4',
  '86A1ECBA089C4A8D3BBE2734C612BA341D813E043CF9E8A862CD5C57A36BBE6B',
]);

export function installEmudhraDistrust() {
  if (typeof tls.setDefaultCACertificates !== 'function') {
    throw new Error('This server requires Node.js with tls.setDefaultCACertificates support.');
  }
  const removed = [];
  const certificates = tls.rootCertificates.filter(pem => {
    const certificate = new X509Certificate(pem);
    const fingerprint = certificate.fingerprint256.replaceAll(':', '');
    if (!affected.has(fingerprint)) return true;
    removed.push({ subject: certificate.subject, fingerprint });
    return false;
  });
  if (certificates.length === 0) throw new Error('No trusted CA certificates remain.');
  tls.setDefaultCACertificates(certificates);
  return { before: tls.rootCertificates.length, after: certificates.length, removed };
}
