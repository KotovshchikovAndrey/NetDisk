package core_config

const (
	AccessTokenTtl  = 60 * 30          // 30 minutes
	RefreshTokenTtl = 60 * 60 * 24 * 7 // 1 week
	CodeTtl         = 30               // 30 seconds
	SessionTtl      = 60 * 60 * 7      // 7 hours
	CodeLength      = 6
)
