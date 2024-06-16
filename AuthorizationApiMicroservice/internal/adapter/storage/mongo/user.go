package mongo

import (
	"authorization/internal/adapter/config"
	"authorization/internal/core/domain"
	"authorization/internal/core/port"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type UserDocument struct {
	ID             string          `bson:"_id"`
	Name           string          `bson:"name"`
	Email          string          `bson:"email"`
	Secret         string          `bson:"secret"`
	IsVerified     bool            `bson:"is_verified"`
	CreatedAt      time.Time       `bson:"created_at"`
	LastLoginAt    time.Time       `bson:"last_login_at"`
	HashedPassword string          `bson:"hashed_password"`
	Codes          []*CodeDocument `bson:"codes"`
}

func convertToUserDocument(user *domain.User) *UserDocument {
	codes := make([]*CodeDocument, len(user.Codes))
	for index, code := range user.Codes {
		codes[index] = convertToCodeDocument(code)
	}

	return &UserDocument{
		ID:             user.ID,
		Name:           user.Name,
		Email:          user.Email,
		Secret:         user.Secret,
		IsVerified:     user.IsVerified,
		CreatedAt:      user.CreatedAt,
		LastLoginAt:    user.LastLoginAt,
		HashedPassword: user.HashedPassword,
		Codes:          codes,
	}
}

func convertToUserDomain(user *UserDocument) *domain.User {
	codes := make([]*domain.Code, len(user.Codes))
	for index, code := range user.Codes {
		codes[index] = convertToCodeDomain(code)
	}

	return &domain.User{
		ID:             user.ID,
		Name:           user.Name,
		Email:          user.Email,
		Secret:         user.Secret,
		IsVerified:     user.IsVerified,
		CreatedAt:      user.CreatedAt,
		LastLoginAt:    user.LastLoginAt,
		HashedPassword: user.HashedPassword,
		Codes:          codes,
	}
}

type CodeDocument struct {
	Value     string             `bson:"value"`
	CreatedAt time.Time          `bson:"created_at"`
	ExpiredAt time.Time          `bson:"expired_at"`
	Purpose   domain.CodePurpose `bson:"purpose"`
}

func convertToCodeDocument(code *domain.Code) *CodeDocument {
	return &CodeDocument{
		Value:     code.Value,
		CreatedAt: code.CreatedAt,
		ExpiredAt: code.ExpiredAt,
		Purpose:   code.Purpose,
	}
}

func convertToCodeDomain(code *CodeDocument) *domain.Code {
	return &domain.Code{
		Value:     code.Value,
		CreatedAt: code.CreatedAt,
		ExpiredAt: code.ExpiredAt,
		Purpose:   code.Purpose,
	}
}

type UserMongoRepository struct {
	client *mongo.Client
}

func NewUserMongoRepository(config *config.Config) (port.UserRepository, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(config.MongoUri))
	if err != nil {
		return nil, err
	}

	return &UserMongoRepository{client: client}, nil
}

func (repository *UserMongoRepository) GetByID(ctx context.Context, id string) (*domain.User, error) {
	collection := repository.getUserCollection()

	userDocument := &UserDocument{}
	err := collection.FindOne(ctx, bson.M{"_id": id}).Decode(userDocument)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, domain.ErrNotFound
		}

		return nil, err
	}

	return convertToUserDomain(userDocument), nil
}

func (repository *UserMongoRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	collection := repository.getUserCollection()

	userDocument := &UserDocument{}
	err := collection.FindOne(ctx, bson.M{"email": email}).Decode(userDocument)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, domain.ErrNotFound
		}

		return nil, err
	}

	return convertToUserDomain(userDocument), nil
}

func (repository *UserMongoRepository) Save(ctx context.Context, user *domain.User) error {
	collection := repository.getUserCollection()
	userDocument := convertToUserDocument(user)

	_, err := collection.UpdateOne(
		ctx,
		bson.M{"_id": userDocument.ID},
		bson.M{"$set": userDocument},
		options.Update().SetUpsert(true),
	)

	if err != nil {
		return err
	}

	return nil
}

func (repository *UserMongoRepository) getUserCollection() *mongo.Collection {
	return repository.client.Database("netdisk").Collection("users")
}
