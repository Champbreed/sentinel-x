package authz
import rego.v1

default allow := false

allow if {
    input.user_id == input.resource_id
}

allow if {
    input.role == "admin"
}
