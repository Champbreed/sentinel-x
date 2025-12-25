package authz

import rego.v1

default allow := false

# Line 6
allow if {
    input.user_id == input.resource_id
}

# Line 11
allow if {
    input.role == "admin"
}




