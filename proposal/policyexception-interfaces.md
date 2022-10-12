# Interfaces Design for operating PolicyExceptions in Kyverno

```go
type PolicyExceptionInterface interface {
	metav1.Object
	// IsNamespaced() bool
	GetSpec() *Spec
	// GetStatus() *PolicyStatus
	// Validate(sets.String) field.ErrorList
	// CreateDeepCopy() PolicyExceptionInterface
	// IsReady() bool
}


type PolicyExceptionStore interface {
    // generate key for map from CRD spec
	func extractKey(kyvernov2beta1.PolicyExceptionInterface)string{}
    // generate value for map from CRD spec
    func extractValue(kyvernov2beta1.PolicyExceptionInterface)kyvernov1.MatchResources{}
	// set inserts a policyException in the cache
	// Example: policyName-ruleName: exclude1
	// set(string, kyvernov2beta1.PolicyExceptionInterface)
	// OR
	set(string, kyvernov2beta1.MatchResources)
	// unset removes a policyException from the cache by policy-rule
	unset(string)
	// get finds all excluded resources under a specific policy-rule
	get(string) []kyvernov2beta1.MatchResources
}


type PolicyExceptionCache struct {
	store PolicyExceptionStore
  // policyName1-ruleName1 : [exclude1, exclude2,...]
	// policyName2-ruleName2: [exclude1, exclude2...]
	exceptions map[string][]kyvernov2beta1.MatchResources
}
```
