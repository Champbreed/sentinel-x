package api.authz

# This tells OPA to use the modern V1 syntax rules
import rego.v1

default allow := false

# Rule: Allow access if the user's ID matches the resource ID
allow if {
    input.user_id == input.resource_id
}

# Rule: Administrative bypass (for demo purposes)
allow if {
    input.role == "admin"
}


