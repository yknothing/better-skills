# Adversary Review: first-customer-finder

**Date**: 2026-07-14  
**Reviewer Role**: Adversary  
**Skill**: first-customer-finder  
**HUMAN_VERIFIED**: false

## Summary

I found three bounded weaknesses: anchor calibration remains judgmental, source coverage can vary by platform access, and a strict public-route requirement may demote some strong enterprise fits. None bypasses the evidence, privacy, or no-fabrication gates. Worst-case impact is an overly conservative shortlist, not fabricated prospects or unauthorized outreach.

## Findings

### F1: Confidence-anchor calibration remains model-dependent [MEDIUM]

**Location**: “Apply Eligibility, Then Confidence Anchors” and `references/evidence-contract.md`  
**Exploit scenario**: A weak researcher labels an indirect source `75` instead of `50`, moving a candidate from Watchlist to Priority 2.  
**Root cause**: Discrete descriptors constrain judgment but cannot make semantic qualification deterministic.  
**Suggested fix**: Keep the binary eligibility gate authoritative, require a written evidence rationale for every anchor, and add calibration fixtures only after real borderline cases accumulate.

### F2: Search coverage is constrained by host access [LOW]

**Location**: Dependencies and Platform Degradation  
**Exploit scenario**: A host can search the open web but cannot access a relevant forum, producing a narrow source mix that looks complete.  
**Root cause**: Public-source availability is platform-dependent.  
**Suggested fix**: Always report source classes searched, inaccessible classes, stop reason, and unverified candidates separately. The current workflow already requires this; test it in future host-specific evaluations.

### F3: Reachability gate can be conservative for enterprise prospects [LOW]

**Location**: Prospect eligibility hard gate  
**Exploit scenario**: A company has strong public pain and timing evidence but no context-relevant public route, so it is demoted despite high fit.  
**Root cause**: The skill optimizes for reachable first customers, not abstract account fit.  
**Suggested fix**: Preserve the current demotion to Watchlist. Do not weaken the gate; instead make the rejection reason explicit so a separately authorized contact-research workflow can revisit it.

## Verdict

**Verdict**: APPROVED

The medium finding concerns unavoidable semantic judgment and is contained by a binary gate, evidence rationales, and adversarial panel review. The skill fails conservatively and does not create a material safety or trust defect.
