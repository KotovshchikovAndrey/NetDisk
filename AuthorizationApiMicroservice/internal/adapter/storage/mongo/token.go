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

type TokenDocument struct {
	ID        string    `bson:"_id"`
	CreatedAt time.Time `bson:"created_at"`
	ExpiredAt time.Time `bson:"expired_at"`
	UserID    string    `bson:"user_id"`
	DeviceID  string    `bson:"device_id"`
	IsRevoked bool      `bson:"is_revoked"`
}

func convertToTokenDocument(token *domain.Token) *TokenDocument {
	return &TokenDocument{
		ID:        token.ID,
		CreatedAt: token.CreatedAt,
		ExpiredAt: token.ExpiredAt,
		UserID:    token.UserID,
		DeviceID:  token.DeviceID,
		IsRevoked: token.IsRevoked,
	}
}

func convertToTokenDomain(token *TokenDocument) *domain.Token {
	return &domain.Token{
		ID:        token.ID,
		CreatedAt: token.CreatedAt,
		ExpiredAt: token.ExpiredAt,
		UserID:    token.UserID,
		DeviceID:  token.DeviceID,
		IsRevoked: token.IsRevoked,
	}
}

// 	RevokeByUser(ctx context.Context, userId string) error

type TokenMongoRepository struct {
	client *mongo.Client
}

func NewTokenMongoRepository(config *config.Config) (port.TokenRepository, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(config.MongoUri))
	if err != nil {
		return nil, err
	}

	return &TokenMongoRepository{client: client}, nil
}

func (repository *TokenMongoRepository) GetByID(ctx context.Context, id string) (*domain.Token, error) {
	collection := repository.getTokenCollection()

	tokenDocument := &TokenDocument{}
	err := collection.FindOne(ctx, bson.M{"_id": id}).Decode(tokenDocument)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, domain.ErrNotFound
		}

		return nil, err
	}

	return convertToTokenDomain(tokenDocument), nil
}

func (repository *TokenMongoRepository) Save(ctx context.Context, token *domain.Token) error {
	collection := repository.getTokenCollection()
	tokenDocument := convertToTokenDocument(token)

	_, err := collection.UpdateOne(
		ctx,
		bson.M{"_id": tokenDocument.ID},
		bson.M{"$set": tokenDocument},
		options.Update().SetUpsert(true),
	)

	if err != nil {
		return err
	}

	return nil
}

func (repository *TokenMongoRepository) RevokeByUserDevice(ctx context.Context, userId string, deviceId string) error {
	collection := repository.getTokenCollection()
	_, err := collection.UpdateMany(
		ctx,
		bson.M{"user_id": userId, "device_id": deviceId},
		bson.M{"$set": bson.M{"is_revoked": true}},
	)

	if err != nil {
		return err
	}

	return nil
}

func (repository *TokenMongoRepository) RevokeByUser(ctx context.Context, userId string) error {
	collection := repository.getTokenCollection()
	_, err := collection.UpdateMany(
		ctx,
		bson.M{"user_id": userId},
		bson.M{"$set": bson.M{"is_revoked": true}},
	)

	if err != nil {
		return err
	}

	return nil
}

func (repository *TokenMongoRepository) getTokenCollection() *mongo.Collection {
	return repository.client.Database("netdisk").Collection("tokens")
}
